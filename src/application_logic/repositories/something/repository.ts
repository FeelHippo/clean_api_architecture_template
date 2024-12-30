import mongoose from 'mongoose';
import { log, log_labels, log_levels } from '../../../framework_and_cloud/monitor/logger';
import { SomethingModel } from './model';
import { SomethingEntity } from '../../../data/something';

export class SomethingDB {
  static async getSomethingById(something_id: string): Promise<SomethingEntity | null> {
    log(log_levels.info, log_labels.db.get_something, { something_id });

    return SomethingModel.findOne({ _id: new mongoose.Types.ObjectId(something_id) });
  }
  static async upsertSomething(something: SomethingEntity): Promise<void> {
    log(log_levels.info, log_labels.db.upsert_something, { something });

    return SomethingModel.findOneAndUpdate(
      {
        something,
      },
      {
        $set: { something },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      },
    );
  }
}
