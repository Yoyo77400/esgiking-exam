import { Schema } from 'mongoose';
import { IAddress } from '../../../models';

export const AddressSchema = new Schema<IAddress>(
  {
    street: { 
      type: String, 
      required: true 
    },
    city: { 
      type: String, 
      required: true 
    },
    postalCode: { 
      type: String, 
      required: true 
    },
  },
  {
    timestamps: true,
    collection: 'addresses',
    versionKey: false,
  }
);
