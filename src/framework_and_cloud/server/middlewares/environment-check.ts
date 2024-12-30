import { Request, Response, NextFunction } from 'express';
import * as HttpStatus from 'http-status-codes';

export default (req: Request, res: Response, next: NextFunction): void => {
  const ENVIRONMENT = req.header('ENVIRONMENT');
  if (!ENVIRONMENT) {
    res.status(HttpStatus.StatusCodes.BAD_REQUEST).send();
  }
  res.locals.ENVIRONMENT = ENVIRONMENT;
  next();
};
