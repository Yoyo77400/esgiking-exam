import { Schema } from 'mongoose';
import { IRestaurant, IEmployee, IAddress } from '../../../models'; // Import unique

// Schéma pour le restaurant
export const RestaurantSchema = new Schema<IRestaurant>(
  {
    name: { 
      type: String, 
      required: true 
    },
    responsable: { 
      type: Schema.Types.ObjectId, 
      ref: 'Employee',  // Référence à la collection 'employees'
      required: true 
    },
    telephone: { 
      type: String, 
      required: true 
    },
    address: { 
      type: Schema.Types.ObjectId, 
      ref: 'Address',  // Référence à la collection 'addresses'
      required: true 
    },
    description: { 
      type: String, 
      required: true 
    },
  },
  {
    timestamps: true,  // Ajoute automatiquement createdAt et updatedAt
    collection: 'restaurants', // Nom de la collection dans MongoDB
    versionKey: false, // Ne pas inclure de champ "__v" (version)
  }
);
