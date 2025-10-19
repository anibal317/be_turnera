import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppLogger } from './common/app-logger.service';
import { RequestLoggerMiddleware } from './common/request-logger.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Log manual para probar creación de logs
  const logger = app.get(AppLogger);
  logger.log('La aplicación se ha iniciado correctamente (prueba de log manual)');

  // Middleware global para loguear todas las requests
  // (Registrado globalmente en AppModule, no es necesario aquí)

  // Habilitar validación global 
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Habilitar CORS
  app.enableCors();

  // Prefijo global para las rutas
  app.setGlobalPrefix('api');

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Turnera API')
    .setDescription('Documentación de la API de Turnera')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`Aplicación corriendo en: http://localhost:${port}/api`);
  console.log(`Swagger disponible en: http://localhost:${port}/api/docs`);
}

bootstrap();
