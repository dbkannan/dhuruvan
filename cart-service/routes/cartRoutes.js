const express = require("express");

const router = express.Router();

const cartController = require("../controllers/cartController");
const {
  ADD_CART_PATH,
  UPDATE_CART_PATH,
  VIEW_CART_PATH,
  DELETE_CART_PATH,
} = require("../../constants/paths");
const { handleCartUpdate, deleteItemFromCart, getCartItems } = cartController;

router.get(VIEW_CART_PATH, getCartItems);
router.post([ADD_CART_PATH, UPDATE_CART_PATH], handleCartUpdate);
router.delete(DELETE_CART_PATH, deleteItemFromCart);

module.exports = router;
