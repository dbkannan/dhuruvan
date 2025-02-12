const express = require("express");
const app = express();
const cors = require("cors");
const productRoutes = require("./routes/productRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const connectDB = require("./db");
require("dotenv").config();

// Use middlewares before routes
app.use(cors());
app.use(express.json()); // Body parser for JSON data

connectDB();
app.use(productRoutes);
app.use(reviewRoutes);
app.listen(process.env.PORT, () => {
  console.log("Product Service is running on port ", process.env.PORT);
});
