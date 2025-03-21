import {
  Catch,
  ArgumentsHost,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

// Interfaz para estandarizar la respuesta de error
interface ErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
  timestamp: string;
  path?: string;
  details?: any;
}

@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(RpcCustomExceptionFilter.name);

  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const path: string = typeof request.url === 'string' ? request.url : '';

    // Obtener el error original del microservicio
    const rpcError = exception.getError();

    this.logger.debug(`RPC error received: ${JSON.stringify(rpcError)}`);

    // Construir una respuesta de error estándar
    const errorResponse: ErrorResponse = this.buildErrorResponse(
      rpcError,
      path,
    );

    // Enviar la respuesta con el código de estado correspondiente
    return response.status(errorResponse.statusCode).json(errorResponse);
  }

  private buildErrorResponse(rpcError: any, path: string): ErrorResponse {
    const timestamp = new Date().toISOString();

    // Caso 1: Error con formato completo (statusCode, message, error)
    if (
      typeof rpcError === 'object' &&
      rpcError !== null &&
      'statusCode' in rpcError &&
      'message' in rpcError &&
      'error' in rpcError
    ) {
      return {
        ...rpcError,
        timestamp,
        path,
      };
    }

    // Caso 2: Error con status/statusCode y message (formato parcial)
    if (
      typeof rpcError === 'object' &&
      rpcError !== null &&
      ('status' in rpcError || 'statusCode' in rpcError) &&
      'message' in rpcError
    ) {
      const status =
        'statusCode' in rpcError ? rpcError.statusCode : rpcError.status;
      const statusCode = this.normalizeStatusCode(status);
      return {
        statusCode,
        message: rpcError.message,
        error: this.getErrorNameFromStatus(statusCode),
        timestamp,
        path,
        details:
          typeof rpcError === 'object' && rpcError !== null
            ? this.extractAdditionalDetails(rpcError as Record<string, unknown>)
            : undefined,
      };
    }

    // Caso 3: Empty response
    if (typeof rpcError === 'string' && rpcError.includes('Empty response')) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'No response received from microservice',
        error: 'Internal Server Error',
        timestamp,
        path,
      };
    }

    // Caso 4: Error en formato string u otro formato desconocido
    return {
      statusCode: HttpStatus.BAD_REQUEST,
      message:
        typeof rpcError === 'string' ? rpcError : 'Unknown microservice error',
      error: 'Bad Request',
      timestamp,
      path,
      details: typeof rpcError !== 'string' ? rpcError : undefined,
    };
  }

  private normalizeStatusCode(status: any): number {
    const statusCode = Number(status);

    if (isNaN(statusCode) || statusCode < 100 || statusCode > 599) {
      return HttpStatus.BAD_REQUEST;
    }

    return statusCode;
  }

  private getErrorNameFromStatus(statusCode: number): string {
    const statusMap: Record<number, string> = {
      400: 'Bad Request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Not Found',
      409: 'Conflict',
      422: 'Unprocessable Entity',
      500: 'Internal Server Error',
      503: 'Service Unavailable',
    };

    return statusMap[statusCode] || 'Unknown Error';
  }

  private extractAdditionalDetails(
    error: Record<string, unknown>,
  ): Record<string, unknown> | undefined {
    if (typeof error !== 'object' || error === null) {
      return undefined;
    }

    // Extraer los campos conocidos y dejar el resto como detalles
    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      status,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      statusCode,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      message,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      error: errorName,
      ...details
    } = error;

    return Object.keys(details).length > 0 ? details : undefined;
  }
}
