import { Schema } from 'mongoose';
import { IRestaurant } from '../../../models/';

export const RestaurantSchema = new Schema<IRestaurant>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    admin: {
      type: String,
    },
  },
  {
    timestamps: true,
    collection: 'restaurants',
    versionKey: false,
  },
);
