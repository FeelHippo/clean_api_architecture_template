import { NextFunction, Request, Response } from 'express';
import { config } from '../../config/index';
import { UnauthorizedUserException } from '../../monitor/error-handler';

export default (request: Request, response: Response, next: NextFunction): void => {
  response.locals.authenticateUser = () => {
    const api_key = request.headers['api-key'] as string;
    if (!api_key || api_key !== config().api_key) {
      throw new UnauthorizedUserException();
    }
  };
  next();
};
