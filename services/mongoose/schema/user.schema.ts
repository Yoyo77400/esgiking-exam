import { Schema } from 'mongoose';
import { IUser } from '../../../models';
import { Models } from '../mongoose.models';

export const UserSchema = new Schema<IUser>(
  {
    firstName: { 
      type: String, 
      required: true 
    },
    lastName: { 
      type: String, 
      required: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true 
    },
    password: { 
      type: String, 
      required: true 
    },
    address: { 
      type: Schema.Types.ObjectId, 
      ref: Models.Address, 
      required: false 
    },
  },
  {
    timestamps: true,
    collection: 'users',
    versionKey: false,
  },
);
