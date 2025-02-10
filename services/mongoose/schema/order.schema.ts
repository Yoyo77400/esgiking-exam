import { Schema } from 'mongoose';
import { IOrder, IOrderItem, IOrderStatus, IProduct, IMenu, IUser, IEmployee, IPromotion } from '../../../models'; // Import unique

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
    user: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    promotion: { 
      type: Schema.Types.ObjectId, 
      ref: 'Promotion', 
      required: false 
    },
    items: [OrderItemSchema],  // Utilisation du schéma pour les articles
    preparator: { 
      type: Schema.Types.ObjectId, 
      ref: 'Employee', 
      required: true 
    },
    deliveryMan: { 
      type: Schema.Types.ObjectId, 
      ref: 'Employee', 
      required: true 
    },
    menu: { 
      type: Schema.Types.ObjectId, 
      ref: 'Menu', 
      required: true 
    },
    status: { 
      type: String, 
      enum: Object.values(IOrderStatus),  // Utilisation de l'enum pour les statuts
      required: true 
    },
  },
  {
    timestamps: true,
    collection: 'orders',
    versionKey: false,
  }
);
