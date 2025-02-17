import { Schema } from 'mongoose';
import { IEmployee } from '../../../models';

export const EmployeeSchema = new Schema<IEmployee>(
  {
    role: { 
      type: String, 
      required: true 
    },
    deliveries: [{ 
      type: Schema.Types.ObjectId, 
      ref: 'deliveries', 
      required: false 
    }],
    restaurant: { 
      type: Schema.Types.ObjectId, 
      ref: 'restaurants', 
      required: false 
    },
    orders: [{ 
      type: Schema.Types.ObjectId, 
      ref: 'orders', 
      required: false 
    }],
    tracker: { 
      type: Schema.Types.ObjectId, 
      ref: 'trackers', 
      required: false 
    },
    session: { 
      type: Schema.Types.ObjectId, 
      ref: 'sessions', 
      required: false 
    },
  },
  {
    timestamps: true,
    collection: 'employees',
    versionKey: false,
  }
);
