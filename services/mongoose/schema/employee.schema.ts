import { Schema } from 'mongoose';
import { IEmployee} from '../../../models';
import { Models } from '../mongoose.models';

export const EmployeeSchema = new Schema<IEmployee>(
  {
    user: { 
      type: Schema.Types.ObjectId, 
      ref: Models.User, 
      required: true 
    },
    role: { 
      type: String, 
      enum: Object.values(IEmployeeRole), 
      required: true 
    },
    address: { 
      type: Schema.Types.ObjectId, 
      ref: Models.Address, 
      required: false 
    },
    deliveries: [{ 
      type: Schema.Types.ObjectId, 
      ref: Models.Delivery, 
      required: false 
    }],
    restaurant: { 
      type: Schema.Types.ObjectId, 
      ref: Models.Restaurant, 
      required: false 
    },
    orders: [{ 
      type: Schema.Types.ObjectId, 
      ref: Models.Order, 
      required: false 
    }],
    tracker: { 
      type: Schema.Types.ObjectId, 
      ref: Models.Tracker, 
      required: false 
    },
    session: { 
      type: Schema.Types.ObjectId, 
      ref: Models.Session, 
      required: false 
    },
  },
  {
    timestamps: true,
    collection: 'employees',
    versionKey: false,
  },
);
