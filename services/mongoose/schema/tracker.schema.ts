import { Schema } from 'mongoose';
import { ITracker, IEmployee } from '../../../models'; // Import unique

// Schéma pour le tracker
export const TrackerSchema = new Schema<ITracker>(
  {
    longitude: { 
      type: Number, 
      required: true 
    },
    latitude: { 
      type: Number, 
      required: true 
    },
    employee: { 
      type: Schema.Types.ObjectId, 
      ref: 'employees',  // Référence à la collection 'employees'
      required: true 
    },
  },
  {
    timestamps: true,  // Ajoute automatiquement createdAt et updatedAt
    collection: 'trackers',  // Nom de la collection dans MongoDB
    versionKey: false,  // Ne pas inclure de champ "__v" (version)
  }
);
