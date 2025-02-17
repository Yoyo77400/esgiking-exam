import { Schema } from 'mongoose';
import { ISession } from '../../../models'; // Import unique

// Schéma pour la session
export const SessionSchema = new Schema<ISession>(
  {
    user: { 
      type: Schema.Types.ObjectId, 
      ref: 'users',  // Référence à la collection 'users'
      required: false 
    },
    employee: { 
      type: Schema.Types.ObjectId, 
      ref: 'employees',  // Référence à la collection 'users'
      required: false 
    },
  },
  {
    timestamps: true,  // Ajoute automatiquement createdAt et updatedAt
    collection: 'sessions', // Nom de la collection dans MongoDB
    versionKey: false, // Ne pas inclure de champ "__v" (version)
  }
);
