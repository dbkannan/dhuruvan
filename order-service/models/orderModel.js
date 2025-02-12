const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  items: [
    {
      title: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      createdAt: { type: Date, default: Date.now },
      orderId: {
        type: String,
        required: true,
        unique: true,
        default: "B" + Math.random().toString(36).substring(2, 15),
      },
    },
  ],
  status: {
    type: String,
    enum: ["pending", "shipped", "delivered", "canceled"],
    default: "pending",
  },
});

OrderSchema.pre("save", function (next) {
  this.items.forEach((item) => {
    item.totalPrice = item.price * item.quantity;
  });
  next();
});

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
