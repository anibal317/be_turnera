import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ObraSocial } from './entities/obra-social.entity';
import { ObraSocialController } from './obra-social.controller';
import { ObraSocialService } from './obra-social.service';

@Module({
  imports: [TypeOrmModule.forFeature([ObraSocial])],
  controllers: [ObraSocialController],
  providers: [ObraSocialService],
  exports: [ObraSocialService],
})
export class ObraSocialModule {}
