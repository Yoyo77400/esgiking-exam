import { Schema } from 'mongoose';
import { IProduct, IMenu, IPromotion, ICategory } from '../../../models'; // Import unique

// Schéma pour le produit
export const ProductSchema = new Schema<IProduct>(
  {
    name: { 
      type: String, 
      required: true 
    },
    description: { 
      type: String, 
      required: true 
    },
    price: { 
      type: Number, 
      required: true 
    },
    menu: { 
      type: Schema.Types.ObjectId, 
      ref: 'menus',  // Référence à la collection 'menus'
      required: false 
    },
    promotion: { 
      type: Schema.Types.ObjectId, 
      ref: 'promotions',  // Référence à la collection 'promotions'
      required: false 
    },
    category: { 
      type: Schema.Types.ObjectId, 
      ref: 'categories',  // Référence à la collection 'categories'
      required: true 
    },
  },
  {
    timestamps: true, // Génère automatiquement createdAt et updatedAt
    collection: 'products', // Nom de la collection dans MongoDB
    versionKey: false, // Ne pas inclure de champ "__v" (version)
  }
);
