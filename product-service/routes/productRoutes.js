const express = require("express");
const {
  addProduct,
  updateProduct,
  getAllProducts,
  getProduct,
  removeProduct,
} = require("../controllers/productController");
const router = express.Router();

const {
  ADMIN_ADD_PRODUCT_PATH,
  ADMIN_UPDATE_PRODUCT_PATH,
  HOME,
  GET_ONE_PRODUCT_PATH,
  ADMIN_DELETE_PRODUCT_PATH,
} = require("../../constants/paths");

router.post(ADMIN_ADD_PRODUCT_PATH, addProduct);

router.put(ADMIN_UPDATE_PRODUCT_PATH, updateProduct);

router.get(HOME, getAllProducts);

router.get(GET_ONE_PRODUCT_PATH, getProduct);

router.delete(ADMIN_DELETE_PRODUCT_PATH, removeProduct);

module.exports = router;
