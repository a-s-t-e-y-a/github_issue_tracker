import { Catch } from "@nestjs/common";
import { HttpException, HttpStatus, ArgumentsHost, ExceptionFilter } from "@nestjs/common";
import { Logger } from "@nestjs/common";

@Catch(HttpException)
export class BetterExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(BetterExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    
    const sanitizedResponse = {
      timestamp: new Date().toISOString(),
      path: request.url,
      status,
      message: this.sanitizeErrorMessage(
        typeof exceptionResponse === 'object' 
          ? (exceptionResponse as any).message || exception.message
          : exception.message
      ),
      error: HttpStatus[status] || 'Internal Server Error',
    };

    this.logger.error(
      `[${request.method}] ${request.url} - ${status}`,
      JSON.stringify(sanitizedResponse)
    );
    
    response.status(status).json(sanitizedResponse);
  }

  private sanitizeErrorMessage(message: string | string[]): string {
    const messageStr = Array.isArray(message) ? message.join(', ') : message;
    return messageStr
      .replace(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi, '***@***.***')
      .replace(/\b\d{4}\d+\b/g, '****')
      .replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '***-***-****');
  }
}