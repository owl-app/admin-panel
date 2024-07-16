import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger
} from '@nestjs/common'
import { Response } from 'express'
import { ValidationError } from 'joi'

import { ApiErrorValidationResponse } from '../api/api-error-validation.response'
import { serializeObject } from '../utils/serialization'
import { ApiErrorResponse } from '../api/api-error.response'
import { RequestContextService } from '../context/app-request-context'

@Catch()
export class ErrorHandlersFilter implements ExceptionFilter {
  public catch(err: unknown, host: ArgumentsHost): void {
    console.log(err)
    console.log('jest error')
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (err instanceof HttpException) {
      response.status(err.getStatus()).json(new ApiErrorResponse({
        statusCode: err.getStatus(),
        error: err.name,
        message: err.message,
        correlationId: RequestContextService.getRequestId(),
      }));

      Logger.error(serializeObject(err));

      return;
    }

    if (err instanceof ValidationError) {
      const errors = err.details.map((detail) => {
        return {
          message: detail.message,
          path: detail.path,
        };
      })

      response.status(HttpStatus.UNPROCESSABLE_ENTITY).json(new ApiErrorValidationResponse(errors));

      Logger.error(serializeObject(err));

      return;
    }

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({});

    Logger.error(serializeObject(err));

    return;
  }
}
