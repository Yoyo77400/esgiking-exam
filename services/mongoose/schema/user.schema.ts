import { Schema } from 'mongoose';
import { IUser, IAddress } from '../../../models'; // Import unique

// Schéma pour l'utilisateur
export const UserSchema = new Schema<IUser>(
  {
    firstName: { 
      type: String, 
      required: true 
    },
    lastName: { 
      type: String, 
      required: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true // S'assure que l'email est unique
    },
    password: { 
      type: String, 
      required: true 
    },
    address: { 
      type: Schema.Types.ObjectId, 
      ref: 'Address', // Référence à la collection 'addresses'
      required: false // L'adresse est optionnelle
    },
  },
  {
    timestamps: true,  // Ajoute automatiquement createdAt et updatedAt
    collection: 'users',  // Nom de la collection dans MongoDB
    versionKey: false,  // Ne pas inclure de champ "__v" (version)
  }
);
