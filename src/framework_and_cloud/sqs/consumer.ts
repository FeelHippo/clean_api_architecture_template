import { Message, SQSClient } from '@aws-sdk/client-sqs';
import { Consumer } from 'sqs-consumer';
import { fromSSO } from '@aws-sdk/credential-providers';
import { log, log_levels, log_labels } from '../monitor/logger';
import { shared_config } from '../config/index';
import { FailedConsumerException } from '../monitor/error-handler';
import assert = require('assert');
import { SomethingControllers } from '../../interface_adapters/controllers/v1';
import { SomethingEntity, Something } from '../../data/something';

export class QueueConsumer {
  private consumer: Consumer;

  constructor() {
    this.consumer = Consumer.create({
      queueUrl: shared_config.sqs.queue_url,
      region: 'eu-west-1',
      sqs: new SQSClient({
        ...(process.env.NODE_ENV === 'LOCAL' && {
          credentials: fromSSO({ profile: 'AWSAdministratorAccess-692087017035' }),
        }),
      }),
      handleMessage: this.messageHandler,
      batchSize: 1,
    });

    this.consumer.on('error', (error: any) => {
      log(log_levels.error, log_labels.sqs.consumer_failed, { error });
    });

    this.consumer.start();
    log(log_levels.info, log_labels.sqs.consumer_started);
  }

  stop(): void {
    this.consumer.stop();
    log(log_levels.warning, log_labels.sqs.consumer_stopped);
  }

  private async messageHandler(message: Message): Promise<void> {
    log(log_levels.info, log_labels.sqs.consumer_message, { message });
    try {
      if (message.Body) {
        const body = JSON.parse(message.Body);
        assert(body.hasOwnProperty('something'), new FailedConsumerException());
        const data: Something = { something: body.something };
        const somethingEntity = new SomethingEntity(data);
        await SomethingControllers.createController(somethingEntity);
        log(log_levels.info, log_labels.sqs.consumer_handled, { message });
      }
    } catch (error) {
      log(log_levels.error, log_labels.sqs.consumer_exception, { error });
      throw error;
    }
  }
}
