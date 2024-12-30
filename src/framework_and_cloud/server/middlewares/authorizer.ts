import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { config } from '../../config/index';

export default (request: Request, response: Response, next: NextFunction): void => {
  const api_key = request.headers['api-key'] as string;

  if (!api_key || api_key !== config().api_key) {
    response.status(StatusCodes.UNAUTHORIZED).send();
    return;
  }

  next();
};
