import { Express } from 'express';
import * as compression from 'compression';
import * as express from 'express';
import * as swaggerUi from 'swagger-ui-express';
import * as expressOpenApi from 'express-openapi';
import * as path from 'path';
import * as YAML from 'yamljs';
import * as fs from 'fs';
import Authorizer from './middlewares/authorizer';
import Validator from './middlewares/validator';
import helmet from 'helmet';
import healthCheck from '../health_check/health-check-router';
import winstonLogger from '../monitor/winston';
import { SomethingControllers } from '../../interface_adapters/controllers/v1';

const createServer = async (): Promise<Express> => {
  const openApiYml = path.join(__dirname, '../server/open_api_description/openapi.yml');

  const app = express();
  const swagger = YAML.load(openApiYml);

  app.use('/health-check', healthCheck);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swagger));

  app.use(helmet());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(compression());
  app.use(winstonLogger);

  await expressOpenApi.initialize({
    app,
    apiDoc: fs.readFileSync(openApiYml, 'utf8'),
    operations: {
      // the below must match the "operationId"s from the schema yml
      getSomething: [Authorizer, Validator, SomethingControllers.getController],
      postSomething: [Authorizer, Validator, SomethingControllers.postController],
    },
  });

  return app;
};

export default createServer;
