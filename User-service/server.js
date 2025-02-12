const express= require('express');
require('dotenv').config();
const app = express()
const connectDB = require("./db");

connectDB()


app.listen(process.env.PORT,()=>{
    console.log('auth-service is running on port ',process.env.PORT)
})