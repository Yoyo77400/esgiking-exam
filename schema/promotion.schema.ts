const mongoose = require('mongoose');
import { Restaurant, Employee } from './index';  // Importer le schema Address

const promotionSchema = new mongoose.Schema({
  type: { 
    type: String, 
    enum: ['menu', 'product', 'account'],
    required: true 
  },
  value: { type: Number, required: true }, 
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true }, 
  startAt: { type: Date, required: true }, 
  endAt: { type: Date, required: true }, 
  responsable: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true }
}, { timestamps: true });

const Promotion = mongoose.model('Promotion', promotionSchema);
 export default Promotion;
