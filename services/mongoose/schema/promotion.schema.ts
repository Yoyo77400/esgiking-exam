import { Schema } from 'mongoose';
import { IPromotion, IRestaurant, IEmployee, PromotionType} from '../../../models'; // Import unique

// Schéma pour la promotion
export const PromotionSchema = new Schema<IPromotion>(
  {
    type: { 
      type: String, 
      enum: Object.values(PromotionType),  // Utilise les valeurs de l'énumération PromotionType
      required: true 
    },
    value: { 
      type: Number, 
      required: true 
    },
    restaurant: { 
      type: Schema.Types.ObjectId, 
      ref: 'restaurants',  // Référence à la collection 'restaurants'
      required: true 
    },
    startAt: { 
      type: Date, 
      required: true 
    },
    endAt: { 
      type: Date, 
      required: true 
    },
    responsable: { 
      type: Schema.Types.ObjectId, 
      ref: 'employees',  // Référence à la collection 'employees'
      required: true 
    },
 
  },
  {
    timestamps: true, // Ajoute automatiquement createdAt et updatedAt
    collection: 'promotions', // Nom de la collection dans MongoDB
    versionKey: false, // Ne pas inclure de champ "__v" (version)
  }
);
