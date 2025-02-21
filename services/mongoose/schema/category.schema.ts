import { Schema } from 'mongoose';
import { ICategory } from '../../../models'; 

export const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    promotion: { type: Schema.Types.ObjectId, ref: 'promotions', required: false },
    products: [{ type: Schema.Types.ObjectId, ref: 'products', required: false }],
  },
  {
    timestamps: true,
    collection: 'categories',
    versionKey: false,
  }
);
