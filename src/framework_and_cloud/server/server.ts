import { Express } from 'express';
import '../config/aws-secrets';
import createServer from './app';
import { QueueConsumer } from '../sqs/consumer';
import { log, log_labels, log_levels } from '../monitor/logger';
import { MongoDbConnection } from '../../application_logic/repositories/db';

const port = process.env.PORT || 3000;
const timeout = 70000;

let connection: MongoDbConnection;
let consumer: QueueConsumer;

createServer()
  .then(async (app: Express) => {
    const server = app.listen(port);
    connection = new MongoDbConnection();
    consumer = new QueueConsumer();
    server.keepAliveTimeout = timeout;
    log(log_levels.info, log_labels.server.init, { port });
  })
  .catch((error: any) => log(log_levels.error, log_labels.server.error, { error }));

// docker stop command - by ECS
process.on('SIGTERM', async () => {
  connection.stop();
  consumer.stop();
});
