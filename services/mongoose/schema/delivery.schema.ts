import { Schema } from 'mongoose';
import { IDelivery, DeliveryStatus } from '../../../models';


export const DeliverySchema = new Schema<IDelivery>(
  {
    address: { 
      type: String, 
      required: true 
    },
    order: { 
      type: Schema.Types.ObjectId, 
      ref: 'Order', 
      required: true 
    },
    status: { 
      type: String, 
      enum: Object.values(DeliveryStatus), 
      required: true, 
      default: DeliveryStatus.PENDING 
    },
    employee: { 
      type: Schema.Types.ObjectId, 
      ref: 'Employee', 
      required: true 
    },
    customer: { 
      type: Schema.Types.ObjectId, 
      ref: 'Customer', 
      required: true 
    },
    chat: { 
      type: Schema.Types.ObjectId, 
      ref: 'Chat', 
      required: true 
    },
    estimated_delivery: { 
      type: Date, 
      required: true 
    },
    actual_delivery: { 
      type: Date, 
      required: false 
    },
  },
  {
    timestamps: true,
    collection: 'deliveries',
    versionKey: false,
  }
);
