import { Schema } from 'mongoose';
import { IEmployee } from '../../../models';

export const EmployeeSchema = new Schema<IEmployee>(
  {
    /*firstName: { 
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
      ref: 'addresses', // Référence à la collection 'addresses'
      required: false // L'adresse est optionnelle
    },*/
    role: { 
      type: String, 
      required: true 
    },
    deliveries: [{ 
      type: Schema.Types.ObjectId, 
      ref: 'deliveries', 
      required: false 
    }],
    restaurant: { 
      type: Schema.Types.ObjectId, 
      ref: 'restaurants', 
      required: false 
    },
    orders: [{ 
      type: Schema.Types.ObjectId, 
      ref: 'orders', 
      required: false 
    }],
    tracker: { 
      type: Schema.Types.ObjectId, 
      ref: 'trackers', 
      required: false 
    },
    session: { 
      type: Schema.Types.ObjectId, 
      ref: 'sessions', 
      required: false 
    }, 
    user: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true
    },
    
  },
  {
    timestamps: true,
    collection: 'employees',
    versionKey: false,
  }
);
