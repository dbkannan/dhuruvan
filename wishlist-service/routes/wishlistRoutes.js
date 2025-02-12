const express = require("express");
const router = express.Router();
const {
  getWishlist,
  addItemToWishlist,
  removeItemFromWishlist,
} = require("../controllers/wishlistController");

router.get("/wishlist/:userId", getWishlist);

router.post("/wishlist/add", addItemToWishlist);

router.delete("/wishlist/remove", removeItemFromWishlist);

module.exports = router;
