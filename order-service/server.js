const express = require("express");
const app = express();
const cors = require("cors");
const orderRoutes = require("./routes/orderRoutes");
const connectDB = require("./db");
require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use(orderRoutes);
connectDB();
app.listen(process.env.PORT, () => {
  console.log("Order Service is running on port ", process.env.PORT);
});
