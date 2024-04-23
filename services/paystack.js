require('dotenv').config();
const axios = require('axios');
const crypto = require('crypto');
const ErrorResponse = require('../utils/errorResponse');

const initializePayment = async (req) => {
    try{
   const { email, amount } = req.body;
     if(!email || !amount){
        throw new ErrorResponse('Email and amount are required', 401)
     }
     const requestData = {
        email,
        amount: amount * 100,
     }
     const options = {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
    }
       const response = await axios.post('https://api.paystack.co/transaction/initialize', requestData, options);
         return response.data;

    }catch(error){
          console.error(error.message);
    }
}





module.exports = {initializePayment};
