const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

router.post("/createorder", createOrder);

router.get("/getorder/:orderId", getOrderById);

router.get("/getallorders", getAllOrders);

router.put("/updatestatus/:orderId/status", updateOrderStatus);

module.exports = router;
