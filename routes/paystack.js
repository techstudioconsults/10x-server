const express = require('express');
const { initializePayment, webhook } = require('../utils/paystack');
const router = express.Router();


router
     .post('/', initializePayment.acceptPayment)
     .post('/webhook', webhook);


module.exports = router;