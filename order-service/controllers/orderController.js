const Order = require("../models/orderModel");

exports.createOrder = async (req, res) => {
  try {
    const { userId, item, status } = req.body;
    const isUserIdPresent = await Order.findOne({ userId });
    console.log({ isUserIdPresent });
    if (!isUserIdPresent) {
      const order = await Order.create({ userId, items: [item], status });
      return res.status(201).json({
        message: "Order created successfully",
        order,
      });
    } else {
      const addedOrder = await Order.findOneAndUpdate(
        { userId },
        { $push: { items: item } }
      );
      return res.status(201).json({
        message: "Order added successfully",
        addedOrder,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({ orderId });

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    return res.status(200).json({ success: true, order });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    return res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!["pending", "shipped", "delivered", "canceled"].includes(status)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid status" });
    }

    const order = await Order.findOneAndUpdate(
      { orderId },
      { status },
      { new: true }
    );

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Order status updated",
      order,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
