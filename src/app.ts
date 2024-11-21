import { INestApplication, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PerformanceInterceptor } from './interceptors/performance.interceptor';
import { BetterExceptionFilter } from './filters/better-exception.filter';

export class Application {
  private readonly logger = new Logger(Application.name);
  private app: INestApplication;

    constructor(app: INestApplication, private readonly configService: ConfigService) {
    this.app = app;
  }

  async configure(): Promise<void> {
    await this.configureCors();
    await this.configureSwagger();
    this.configureGlobalFilters();
    this.configureGlobalInterceptors();
  }

  private async configureCors(): Promise<void> {
    const corsConfig = this.configService.get('cors');
    this.app.enableCors(corsConfig);
    this.app.setGlobalPrefix('api');
  }

  private async configureSwagger(): Promise<void> {
    const swaggerPath = this.configService.get('swagger.path');
    if (this.configService.get('swagger.enabled')) {
      const config = new DocumentBuilder()
        .setTitle('Github Issues Tracker')
        .setDescription('API for Github Issues Tracker')
        .setVersion('1.0')
        .addTag('issues')
        .addBearerAuth()
        .addServer(`http://localhost:${this.configService.get('port')}`)
        .build();

      const document = SwaggerModule.createDocument(this.app, config);
      SwaggerModule.setup(swaggerPath, this.app, document);
    }
  }

  private configureGlobalFilters(): void {
    this.app.useGlobalFilters(new BetterExceptionFilter());
  }

  private configureGlobalInterceptors(): void {
    this.app.useGlobalInterceptors(new PerformanceInterceptor());
  }

  async start(): Promise<void> {
    const configService = this.app.get(ConfigService);
    const port = configService.get('port');
    this.logger.log(`Starting application on port ${port}`);
    await this.app.listen(port);
    this.logger.log(`Application is running on: http://localhost:${port}`);
  }
} 