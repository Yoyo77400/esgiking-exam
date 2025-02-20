import { Schema } from 'mongoose';
import { ICustomer } from '../../../models'; // Import unique

export const CustomerSchema = new Schema<ICustomer>(
  {
    user: { 
      type: Schema.Types.ObjectId, 
      ref: 'users', 
      required: false 
    },
    orders: [{ 
      type: Schema.Types.ObjectId, 
      ref: 'orders', 
      required: false 
    }],
    session: { 
      type: Schema.Types.ObjectId, 
      ref: "sessions", 
      required: false 
    },
  },
  {
    timestamps: true,
    collection: 'customers',
    versionKey: false,
  }
);
