import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction) {
    const { method, originalUrl, ip } = request;
    const userAgent = request.get('user-agent') || '';
    const startTime = Date.now();

    response.on('finish', () => {
      const responseTime = Date.now() - startTime;
      const { statusCode } = response;

      this.logger.log(
        `${method} ${originalUrl} ${statusCode} - ${responseTime}ms - ${ip} - ${userAgent}`
      );
    });

    next();
  }
} 