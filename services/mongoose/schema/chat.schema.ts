import { Schema } from 'mongoose';
import { IChat } from '../../../models'; // Import unique

export const ChatSchema = new Schema<IChat>(
  {
    delivery: { 
      type: Schema.Types.ObjectId, 
      ref: 'Delivery', 
      required: true 
    },
    message: { 
      type: String, 
      required: true 
    },
    is_read: { 
      type: Boolean, 
      required: true, 
      default: false 
    },
  },
  {
    timestamps: true,
    collection: 'chats',
    versionKey: false,
  }
);
