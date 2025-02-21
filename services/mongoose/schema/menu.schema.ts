import { Schema } from 'mongoose';
import { IMenu, IProduct } from '../../../models'; // Import unique

export const MenuSchema = new Schema<IMenu>(
  {
    name: { 
      type: String, 
      required: true 
    },
    description: { 
      type: String, 
      required: true 
    },
    products: [{ 
      type: Schema.Types.ObjectId, 
      ref: 'products', 
      required: true 
    }],
    promotion: { 
      type: Schema.Types.ObjectId, 
      ref: 'promotions', 
      required: false 
    },
  },
  {
    timestamps: true,
    collection: 'menus',
    versionKey: false,
  }
);
