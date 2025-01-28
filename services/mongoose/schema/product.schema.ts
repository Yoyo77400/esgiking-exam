import { Schema } from 'mongoose';
import { IProduct } from '../../../models';

export const ProductSchema = new Schema<IProduct>({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    composition: [{ type: String, required: true }],
    promotions: [{ type: Schema.Types.ObjectId, required: false, ref: "promotions" }],
}, {
    timestamps: true,
    collection: "products",
    versionKey: false
});
