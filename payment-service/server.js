const express= require('express');
const app = express()
const productRoutes = require('./routes/productRoutes')

app.use(productRoutes)

app.listen(process.env.PORT,()=>{
    console.log('Server is running on port ',process.env.PORT)
})