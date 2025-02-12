const express= require('express');
const app = express()
const axios = require('axios')

app.get("/product-service",(req,res)=>{
    axios.get('http://localhost:5001/product')
    .then(response=>{
        res.json(response.data)
        console.log(response.data)
    })
})   

app.listen(process.env.PORT,()=>{
    console.log('Api Gateway is running');
})