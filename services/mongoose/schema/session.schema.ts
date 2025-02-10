import { Schema } from 'mongoose';
import { ISession, IUser } from '../../../models'; // Import unique

// Schéma pour la session
export const SessionSchema = new Schema<ISession>(
  {
    accessToken: { 
      type: String, 
      required: true 
    },
    user: { 
      type: Schema.Types.ObjectId, 
      ref: 'User',  // Référence à la collection 'users'
      required: true 
    },
  },
  {
    timestamps: true,  // Ajoute automatiquement createdAt et updatedAt
    collection: 'sessions', // Nom de la collection dans MongoDB
    versionKey: false, // Ne pas inclure de champ "__v" (version)
  }
);
