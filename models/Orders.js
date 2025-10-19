const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema({
  line1: { type: String, required: true },
  line2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
});

const OrderSchema = new mongoose.Schema({
  product: {
    id: { type: String, required: true }, // keep as string to accept frontend IDs
    name: { type: String, required: true },
    pricePerKg: { type: Number, required: true },
    mrpPerKg: { type: Number },
  },
  quantityKg: { type: Number, required: true, default: 1 },
  priceBreakup: {
    totalPrice: { type: Number, required: true },
    discountPercent: { type: Number, default: 0 },
  },
  user: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    address: { type: AddressSchema, required: true },
  },
  paymentMethod: { type: String, enum: ["cod", "upi", "online"], default: "cod" },
  status: { type: String, enum: ["pending", "confirmed", "dispatched", "delivered", "cancelled"], default: "pending" },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.models.Order || mongoose.model("Order", OrderSchema);
