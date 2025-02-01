import { Schema } from 'mongoose';
import { IPromotion } from '../../../models';

export const PromotionSchema = new Schema<IPromotion>(
  {
    type: {
      type: String,
      required: true,
      enum: ['PERCENTAGE', 'FIXED'],
    },
    value: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'products',
      },
    ],
  },
  {
    timestamps: true,
    collection: 'promotions',
    versionKey: false,
  },
);
