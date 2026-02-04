import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    console.error('--- EXCEPTION CAUGHT ---');
    console.error('URL:', request.url);
    console.error('Status:', status);
    console.error('Error:', exception);
    if (exception instanceof Error) {
      console.error('Stack:', exception.stack);
    }
    console.error('------------------------');

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message:
        (exception as any)?.message ||
        (exception as any)?.response?.message ||
        'Internal server error',
      error: exception instanceof Error ? exception.name : 'UnknownError',
    });
  }
}
