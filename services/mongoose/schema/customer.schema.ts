import { Schema } from 'mongoose';
import { ICustomer } from '../../../models'; // Import unique

export const CustomerSchema = new Schema<ICustomer>(
  {
    user: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    orders: [{ 
      type: Schema.Types.ObjectId, 
      ref: 'Order', 
      required: false 
    }],
    session: { 
      type: Schema.Types.ObjectId, 
      ref: 'Session', 
      required: false 
    },
  },
  {
    timestamps: true,
    collection: 'customers',
    versionKey: false,
  }
);
