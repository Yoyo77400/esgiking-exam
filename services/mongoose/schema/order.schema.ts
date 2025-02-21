import { Schema } from 'mongoose';
import { IOrder, IOrderItem, IOrderStatus } from '../../../models';

// Schéma pour l'article de la commande
const OrderItemSchema = new Schema<IOrderItem>(
  {
    type: { 
      type: String, 
      enum: ['PRODUCT', 'MENU'], 
      required: true 
    },
    item: { 
      type: Schema.Types.ObjectId, 
      refPath: 'type', 
      required: true 
    },
    quantity: { 
      type: Number, 
      required: true 
    }
  },
  {
    _id: false,  
  }
);

// Schéma pour la commande
export const OrderSchema = new Schema<IOrder>(
  {
    customer: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    promotion: { 
      type: Schema.Types.ObjectId, 
      ref: 'promotions', 
      required: false 
    },
    items: [OrderItemSchema],  // Utilisation du schéma pour les articles de la commande
    deliveryMan: { 
      type: Schema.Types.ObjectId, 
      ref: 'employees', 
      required: true 
    },
    menu: { 
      type: Schema.Types.ObjectId, 
      ref: 'menus', 
      required: true 
    },
    status: { 
      type: String, 
      enum: Object.values(IOrderStatus),  // Utilisation de l'enum pour les statuts
      required: true 
    },
    restaurant: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'orders',
    versionKey: false,
  }
);
