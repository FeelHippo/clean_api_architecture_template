import { NextFunction, Request, Response } from 'express';
import * as openApiRequestValidator from 'openapi-request-validator';

export interface RequestWithValidation extends Request {
  validateRequest: (request: Request) => any | undefined;
  operationDoc: any;
}

export interface ResponseWithValidation extends Response {
  validateResponse: (statusCode: number, payload: object) => any | undefined;
}

export default (request: RequestWithValidation, _response: Response, next: NextFunction): void => {
  request.validateRequest = new openApiRequestValidator.default({
    parameters: request.operationDoc.parameters,
  }).validateRequest;
  next();
};
