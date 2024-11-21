import { WinstonModuleOptions } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

export const createLoggerConfig = (environment: string): WinstonModuleOptions => ({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(),
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, context, ms }) => {
          return `[${timestamp}] ${level} [${context || 'Application'}] ${message} ${ms}`;
        }),
      ),
    }),
    ...(environment !== 'test' ? [
      new winston.transports.DailyRotateFile({
        filename: 'logs/error-%DATE%.log',
        level: 'error',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json()
        ),
      }),
      new winston.transports.DailyRotateFile({
        filename: 'logs/application-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json()
        ),
      }),
    ] : []),
  ],
}); 