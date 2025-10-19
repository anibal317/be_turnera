import { Injectable, LoggerService } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

const LOG_FILE = path.resolve(__dirname, '../../../logs/app.log');

@Injectable()
export class AppLogger implements LoggerService {
  log(message: string) {
    this.writeLog('LOG', message);
  }
  error(message: string, trace?: string) {
    this.writeLog('ERROR', message, trace);
  }
  warn(message: string) {
    this.writeLog('WARN', message);
  }
  debug(message: string) {
    this.writeLog('DEBUG', message);
  }
  verbose(message: string) {
    this.writeLog('VERBOSE', message);
  }

  private writeLog(level: string, message: string, trace?: string) {
    const timestamp = new Date().toISOString();
    const log = `[${timestamp}] [${level}] ${message}${trace ? ' | ' + trace : ''}\n`;
    fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true });
    fs.appendFileSync(LOG_FILE, log, { encoding: 'utf8' });
  }

  static getLogs(limit = 100): string[] {
    if (!fs.existsSync(LOG_FILE)) return [];
    const lines = fs.readFileSync(LOG_FILE, 'utf8').split('\n').filter(Boolean);
    return lines.slice(-limit);
  }
}
