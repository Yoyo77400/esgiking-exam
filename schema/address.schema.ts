const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true }
}, { _id: false });

const Address = mongoose.model('Address', addressSchema);
export default Address;
