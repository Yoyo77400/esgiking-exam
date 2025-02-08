const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  //product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, <-- Inutile Si c'est les produits qui pointent vers le menu ?
  price: { type: Number, required: true },
  promotion: { type: mongoose.Schema.Types.ObjectId, ref: 'Promotion', required: false } // optionnel
}, { timestamps: true });

const Menu = mongoose.model('Menu', menuSchema);
export default Menu;
