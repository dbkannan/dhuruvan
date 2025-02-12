const express = require("express");
const {
  handleReview,
  updateReview,
  getReviewsByProductId,
  deleteReview,
} = require("../controllers/reviewController");
const router = express.Router();

router.post("/product/review", handleReview);

router.put("/product/:productId/review/:reviewId", updateReview);

router.get("/product/:productId/reviews", getReviewsByProductId);

router.delete("/product/:productId/review/:reviewId", deleteReview);

module.exports = router;
