import { ISession } from '../../../models';
import { Schema } from 'mongoose';
import { Models } from '../mongoose.models';

export const sessionSchema = new Schema<ISession>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: Models.User,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'session',
    versionKey: false,
  },
);
