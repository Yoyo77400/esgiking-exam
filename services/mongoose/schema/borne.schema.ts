import { Schema } from 'mongoose';
import { IBorne, BorneStatus } from '../../../models';


export const BorneSchema = new Schema<IBorne>(
  {
    
    restaurant: { 
      type: Schema.Types.ObjectId, 
      ref: 'restaurants', 
      required: true 
    },
    status: { 
      type: String, 
      enum: Object.values(BorneStatus), 
      required: true, 
      default: BorneStatus.DISABLE 
    },
    
  },
  {
    timestamps: true,
    collection: 'bornes',
    versionKey: false,
  }
);
