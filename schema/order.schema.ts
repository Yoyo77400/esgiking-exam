const mongoose = require('mongoose');
import { Restaurant, Order } from 'index';


const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  promotion: { type: mongoose.Schema.Types.ObjectId, ref: 'Promotion', required: false }, // la promotion est optionnelle
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }], 
  menu: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu', required: false }, // le menu est optionnel
  preparator: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: false }, //  Préparateur optionnel avant attribution par responsable
  deliveryMan: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: false }, // Livreur optionnel car sur place possible 
  status: { 
    type: String, 
    enum: ['pending', 'preparing', 'ready', 'delivering', 'delivered', 'canceled'], 
    default: 'pending' 
  }
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;
