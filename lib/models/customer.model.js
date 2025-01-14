const { Schema, model } = require("mongoose");

const CustomerSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },

})

const Customer = model('Customer', CustomerSchema);

module.exports = Customer;