const express= require('express');
const app = express()
const productRoutes = require('./routes/productRoutes')
require("dotenv").config();
app.use(productRoutes)

const connectDB = require('./db')

connectDB();
app.listen(process.env.PORT,()=>{
    console.log('Server is running on port ',process.env.PORT)
})