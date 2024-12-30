import mongoose from 'mongoose';
import { Something } from '../../../data/something';

export interface SomethingDocument extends Something, mongoose.Document {}

let SomethingModel: mongoose.Model<SomethingDocument, {}, {}>;

export const createSomethingModel = async (): Promise<void> => {
  const SomethingSchema = new mongoose.Schema(
    {
      something: {
        type: String,
        required: true,
      },
    },
    {
      timestamps: true,
      collection: 'something',
    },
  );

  SomethingSchema.index({ something: 1 }, { name: 'something_index', unique: true });

  SomethingModel = mongoose.model<SomethingDocument>('something', SomethingSchema);

  await SomethingModel.ensureIndexes();
};

export { SomethingModel };
