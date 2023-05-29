const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ["Processing", "Shipped", "Delivered"],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  productIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});

module.exports = mongoose.model("Order", OrderSchema);
