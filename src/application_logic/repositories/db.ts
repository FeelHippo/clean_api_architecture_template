import * as mongoose from 'mongoose';
import { log, log_levels, log_labels } from '../../framework_and_cloud/monitor/logger';
import { config } from '../../framework_and_cloud/config';
import { createSomethingModel } from './something/model';

export class MongoDbConnection {
  private connection: typeof mongoose | undefined;

  constructor() {
    (async () => {
      try {
        const mongodb_uri = config().mongodb.uri;
        this.connection = await mongoose.connect(mongodb_uri);
        await createSomethingModel();
        log(log_levels.info, log_labels.db.connect_success, {});
      } catch (error) {
        log(log_levels.error, log_labels.db.connect_error, { error });
        throw error;
      }
    })();
  }

  stop(): void {
    this.connection?.disconnect();
    this.connection = undefined;
  }
}
