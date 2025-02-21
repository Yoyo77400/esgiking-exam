import { Schema } from 'mongoose';
import { ITracker } from '../../../models'; // Import unique

// Schéma pour le tracker
export const TrackerSchema = new Schema<ITracker>(
  {
    longitude: { 
      type: Number,
      default: 0, 
      required: true 
    },
    latitude: { 
      type: Number, 
      default: 0,
      required: true
    },
    employee_id: {
      type: Schema.Types.ObjectId,
      ref: 'employees',
      required: true
    },
  },
  {
    timestamps: true,  // Ajoute automatiquement createdAt et updatedAt
    collection: 'trackers',  // Nom de la collection dans MongoDB
    versionKey: false,  // Ne pas inclure de champ "__v" (version)
  }
);
