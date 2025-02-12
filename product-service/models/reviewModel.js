const { Schema, model } = require("mongoose");

// Define the Review Schema
const reviewSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: "Product", // Reference to the Product model
    required: true,
  },
  reviews: [
    {
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
      },
      date: {
        type: Date,
        required: true,
        default: Date.now,
      },
      reviewerName: {
        type: String,
        required: true,
      },
      reviewerEmail: {
        type: String,
        required: true,
      },
    },
  ],
});


// Create the model using the schema
const Review = model("Review", reviewSchema);

// Export the model
module.exports = Review;
