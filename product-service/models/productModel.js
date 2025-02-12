const {Schema,model} = require('mongoose');

const productSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  discountPercentage: {
    type: Number,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  stock: {
    type: Number,
    required: true
  },
  tags: {
    type: [String],
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  sku: {
    type: String,
    required: true
  },
  weight: {
    type: Number,
    required: true
  },
  dimensions: {
    width: {
      type: Number,
      required: true
    },
    height: {
      type: Number,
      required: true
    },
    depth: {
      type: Number,
      required: true
    }
  },
  warrantyInformation: {
    type: String,
    required: true
  },
  shippingInformation: {
    type: String,
    required: true
  },
  availabilityStatus: {
    type: String,
    required: true
  },
  returnPolicy: {
    type: String,
    required: true
  },
  minimumOrderQuantity: {
    type: Number,
    required: true,
    min:1
  },
  meta: {
    createdAt: {
      type: Date,
      required: true
    },
    updatedAt: {
      type: Date,
      required: true
    },
  },
  thumbnail: {
    type: String
  },
  images: {
    type: [String],
    required: true,
  }
});

const Product = model('Product', productSchema);

module.exports = Product;
