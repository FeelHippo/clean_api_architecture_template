import {
  errorHandler,
  InvalidFormatException,
  InvalidPayloadException,
} from '../../../framework_and_cloud/monitor/error-handler';
import {
  RequestWithValidation,
  ResponseWithValidation,
} from '../../../framework_and_cloud/server/middlewares/validator';
import * as HttpStatus from 'http-status-codes';
import publisher from '../../../framework_and_cloud/sqs/publisher';
import { SomethingDbInterface } from '../../../entity_logic/storage';
import { SomethingEntity } from '../../../data/something';

export class SomethingControllers {
  static getController = async (request: RequestWithValidation, response: ResponseWithValidation): Promise<void> => {
    try {
      response.locals.authenticateUser();

      if (request.validateRequest(request)) {
        throw new InvalidFormatException();
      }
      const { something_id } = request.params;
      const something_entity = await SomethingDbInterface.getSomethingById(something_id);

      if (something_entity && response.validateResponse(200, something_entity)) {
        throw new InvalidPayloadException();
      }

      response.status(HttpStatus.StatusCodes.OK).json(something_entity);
    } catch (err) {
      errorHandler(response, err, 'getController');
    }
  };
  static postController = async (request: RequestWithValidation, response: ResponseWithValidation): Promise<void> => {
    try {
      response.locals.authenticateUser();

      if (request.validateRequest(request)) {
        throw new InvalidFormatException();
      }

      await publisher.publishSomething(JSON.stringify(request.body));

      response.status(HttpStatus.StatusCodes.CREATED).send();
    } catch (err) {
      errorHandler(response, err, 'postController');
    }
  };
  static createController = (somethingEntity: SomethingEntity): Promise<void> =>
    SomethingDbInterface.upsertSomething(somethingEntity);
}
