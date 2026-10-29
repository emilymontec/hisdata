import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Captura toda excepción no manejada.
 * Regla de seguridad del proyecto: nunca exponer stack traces, consultas SQL,
 * rutas de archivos ni datos clínicos/credenciales en la respuesta al cliente.
 * El detalle completo se registra únicamente en el log técnico del servidor.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isHttpException = exception instanceof HttpException;
    const status = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const clientMessage = isHttpException
      ? exception.getResponse()
      : 'Ha ocurrido un error inesperado. Intente nuevamente más tarde.';

    // Log técnico interno (nunca se envía al cliente)
    this.logger.error({
      path: request.url,
      method: request.method,
      status,
      error: isHttpException ? exception.message : (exception as Error)?.stack,
    });

    response.status(status).json({
      statusCode: status,
      message: clientMessage,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
