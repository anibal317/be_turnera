import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AppLogger } from './app-logger.service';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: AppLogger) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      const status = res.statusCode;
      let user = 'anon';
      if (req.user) {
        try {
          user = JSON.stringify(req.user);
        } catch {
          user = 'auth';
        }
      }
      this.logger.log(
        `[${method}] ${originalUrl} - ${status} (${duration}ms) - user: ${user}`
      );
    });
    next();
  }
}
