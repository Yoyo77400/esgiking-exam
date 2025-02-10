import mongoose from 'mongoose';
import { Address, Employee } from './index';  // Importer le schema Address

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  responsable: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  telephone: { type: String, required: true },
  address: { type: Address, required: true },  // Utiliser le schéma Address ici
  description: { type: String }
}, { timestamps: true });

const Restaurant = mongoose.model('Restaurant', restaurantSchema);
export default Restaurant;
