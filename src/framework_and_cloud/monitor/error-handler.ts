import { Response } from 'express';
import { log, log_labels, log_levels } from './logger';
import * as Http from 'http-status-codes';

export enum ErrorCodes {
  CREATE_TOKEN_ERROR = 'CREATE_TOKEN_ERROR',
  INVALID_FORMAT = 'INVALID_FORMAT',
  FAILED_OPERATION = 'FAILED_OPERATION',
  INVALID_PAYLOAD = 'INVALID_PAYLOAD',
  FAILED_PUBLISHER_ERROR = 'FAILED_PUBLISHER_ERROR',
  FAILED_CONSUMER_ERROR = 'FAILED_CONSUMER_ERROR',
}

export class ApiClientException extends Error {
  constructor(error_code: string) {
    super();
    this.name = error_code;
    this.message = 'Api call unexpected reply.';
  }
}

export class InvalidFormatException extends Error {
  constructor() {
    super();
    this.name = ErrorCodes.INVALID_FORMAT;
    this.message = 'Invalid payload received';
  }
}

export class InvalidPayloadException extends Error {
  constructor() {
    super();
    this.name = ErrorCodes.INVALID_PAYLOAD;
    this.message = 'Received wrong payload from source';
  }
}

export class CreateTokenException extends Error {
  constructor() {
    super();
    this.name = ErrorCodes.CREATE_TOKEN_ERROR;
    this.message = 'It was not possible to create a JWT token.';
  }
}

export class FailedPublisherException extends Error {
  constructor() {
    super();
    this.name = ErrorCodes.FAILED_PUBLISHER_ERROR;
    this.message = 'It was not possible to publish the message.';
  }
}

export class FailedConsumerException extends Error {
  constructor() {
    super();
    this.name = ErrorCodes.FAILED_CONSUMER_ERROR;
    this.message = 'It was not possible to process the message.';
  }
}

export function errorHandler(res: Response, error: Error, origin: string): Response {
  log(log_levels.error, log_labels.modules.operation_failed, { error: JSON.stringify(error), origin });
  const error_object = { success: false, error_code: error.name, message: error.message || '' };
  switch (error.constructor) {
    case ApiClientException:
    case CreateTokenException:
      return res.status(Http.StatusCodes.INTERNAL_SERVER_ERROR).send(error_object);
    case InvalidFormatException:
    case InvalidPayloadException:
      return res.status(Http.StatusCodes.UNPROCESSABLE_ENTITY).send(error_object);
    case FailedPublisherException:
      return res.status(Http.StatusCodes.BAD_REQUEST).send(error_object);
    default:
      return res.status(Http.StatusCodes.INTERNAL_SERVER_ERROR).send(error_object);
  }
}
