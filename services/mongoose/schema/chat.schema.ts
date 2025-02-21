import { Schema } from 'mongoose';
import { IChat } from '../../../models'; // Import unique

export const ChatSchema = new Schema<IChat>(
  {
    message: { 
      type: String, 
    },
    is_read: { 
      type: Boolean, 
      required: true, 
      default: false 
    },
    delivery_id: { 
      type: Schema.Types.ObjectId,
      ref: 'deliveries', 
      required: true 
    },
  },
  {
    timestamps: true,
    collection: 'chats',
    versionKey: false,
  }
);
