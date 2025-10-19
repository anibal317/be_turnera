import { Module } from '@nestjs/common';
import { LogsController } from './logs.controller';
import { AppLogger } from '../../common/app-logger.service';

@Module({
  controllers: [LogsController],
  providers: [AppLogger],
})
export class LogsModule {}
