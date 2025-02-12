const Review = require("../models/reviewModel");

exports.handleReview = async (req, res) => {
  const { productId, review } = req.body;
  try {
    const isProductExist = await Review.findOne({ productId });

    if (!isProductExist) {
      const newProduct = await Review.create({
        productId,
        reviews: [review],
      });
      console.log({ newProduct });
      return res.status(201).json({ message: "Review created successfully" });
    } else {
      const existingReview = await Review.findOne({
        productId,
        "reviews.reviewerEmail": review.reviewerEmail,
      });

      if (existingReview) {
        const updatedReview = await Review.findOneAndUpdate(
          {
            productId,
            "reviews.reviewerEmail": review.reviewerEmail,
          },
          {
            $set: {
              "reviews.$.rating": review.rating,
              "reviews.$.comment": review.comment,
            },
          },
          { new: true }
        );
        console.log({ updatedReview });
        return res.status(200).json({ message: "Review updated successfully" });
      } else {
        const addedReview = await Review.findOneAndUpdate(
          { productId },
          { $push: { reviews: review } },
          { new: true }
        );
        console.log({ addedReview });
        return res.status(201).json({ message: "Review added successfully" });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating review" });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const { productId, reviewId } = req.params;
    const updatedData = req.body;

    const productExists = await Product.findById(productId);
    if (!productExists) {
      return res.status(404).json({
        message: "Product not found",
      });
    }
    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedReview) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    res.status(200).json({
      message: "Review updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating product",
      error: error.message,
    });
  }
};

exports.getReviewsByProductId = async (req, res) => {
  try {
    const { productId } = req.params;

    const review = await Review.findOne({ productId });
    console.log(review, review.reviews);
    if (!review) {
      return res.status(404).json({
        message: "No reviews found for this product",
      });
    }

    res.status(200).json({
      message: "Reviews retrieved successfully",
      reviews: review.reviews,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving reviews",
      error: error.message,
    });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const { productId, reviewId } = req.params;

    const review = await Review.findOne({ productId, "reviews._id": reviewId });

    if (!review) {
      return res.status(404).json({
        message: "Review not found for this product",
      });
    }

    if (review.reviews.length === 1) {
      const deletedProduct = await Review.findOneAndDelete({ productId });

      if (!deletedProduct) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      return res.status(200).json({
        message: "Product and its only review removed successfully",
      });
    } else {
      const deletedReview = await Review.findOneAndUpdate(
        { productId },
        { $pull: { reviews: { _id: reviewId } } },
        { new: true }
      );

      if (!deletedReview) {
        return res.status(404).json({
          message: "Review not found",
        });
      }

      res.status(200).json({
        message: "Review removed successfully",
        product: deletedReview,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error removing review",
      error: error.message,
    });
  }
};
