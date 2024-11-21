import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import { createLoggerConfig } from './config/logger.config';
import { Application } from './app';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const environment = process.env.NODE_ENV || 'development';
  
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(createLoggerConfig(environment)),
  });

  const application = new Application(app, app.get(ConfigService));
  await application.configure();
  await application.start();
}

if (require.main === module) {
  bootstrap();
}

export { bootstrap }; //for testing