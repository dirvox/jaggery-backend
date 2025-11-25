import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema({
  line1: { type: String, required: true },
  line2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
});

const ItemSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  pricePerKg: { type: Number, required: true },
  mrpPerKg: { type: Number },
  quantityKg: { type: Number, required: true },
  subtotal: { type: Number, required: true }, // pricePerKg * quantityKg
});

const PriceBreakupSchema = new mongoose.Schema({
  subtotal: { type: Number, required: true },
  discountPercent: { type: Number, default: 0 },
  discountAmount: { type: Number, default: 0 },
  gstPercent: { type: Number, required: true },
  gstAmount: { type: Number, required: true },
  deliveryCharges: { type: Number, required: true },
  finalAmount: { type: Number, required: true },
});

const OrderSchema = new mongoose.Schema({
  items: { type: [ItemSchema], required: true },

  priceBreakup: { type: PriceBreakupSchema, required: true },

  user: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    address: { type: AddressSchema, required: true },
  },

  paymentMethod: {
    type: String,
    enum: ["cod", "upi", "online"],
    default: "cod",
  },

  status: {
    type: String,
    enum: ["pending", "confirmed", "dispatched", "delivered", "cancelled"],
    default: "pending",
  },

  notes: { type: String },

  createdAt: { type: Date, default: Date.now },
});

const Orders = mongoose.models.Order || mongoose.model("Orders", OrderSchema);
export default Orders;
