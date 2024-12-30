import { SQS } from '@aws-sdk/client-sqs';
import { fromSSO } from '@aws-sdk/credential-providers';
import { log, log_levels, log_labels } from '../monitor/logger';
import { config } from '../config/index';
import { FailedPublisherException } from '../monitor/error-handler';

class Publisher {
  private instance: SQS;

  constructor() {
    this.instance = new SQS({
      ...(process.env.NODE_ENV === 'LOCAL' && {
        credentials: fromSSO({ profile: 'AWSAdministratorAccess-123456789123' }),
      }),
    });
    log(log_levels.info, log_labels.sqs.publisher_started);
  }

  async publishSomething(message_body: string): Promise<void> {
    try {
      this.instance.sendMessage(
        {
          MessageBody: message_body,
          QueueUrl: config().sqs.queue_url,
        },
        (err: any, data: any) => {
          if (err) {
            log(log_levels.error, log_labels.sqs.publisher_error, { err });
          }
          log(log_levels.info, log_labels.sqs.publisher_data, { data });
        },
      );
    } catch (error) {
      log(log_levels.error, log_labels.sqs.publisher_error, { error });
      throw new FailedPublisherException();
    }
  }
}

export default new Publisher();
