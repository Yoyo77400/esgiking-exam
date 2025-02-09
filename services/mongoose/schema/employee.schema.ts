import { Schema } from 'mongoose';
import { IEmployee } from '../../../models';

export const EmployeeSchema = new Schema<IEmployee>(
  {
    role: { 
      type: String, 
      required: true 
    },
    user: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    deliveries: [{ 
      type: Schema.Types.ObjectId, 
      ref: 'Delivery', 
      required: false 
    }],
    restaurant: { 
      type: Schema.Types.ObjectId, 
      ref: 'Restaurant', 
      required: false 
    },
    orders: [{ 
      type: Schema.Types.ObjectId, 
      ref: 'Order', 
      required: false 
    }],
    tracker: { 
      type: Schema.Types.ObjectId, 
      ref: 'Tracker', 
      required: false 
    },
    session: { 
      type: Schema.Types.ObjectId, 
      ref: 'Session', 
      required: false 
    },
  },
  {
    timestamps: true,
    collection: 'employees',
    versionKey: false,
  }
);
