const express = require('express');
const { initializePayment, verifyPaymentRef } = require('../utils/paystack');
const whitelistIP = require('../middleware/whitelist');
const verifyPayment = require('../utils/verifyPayment');


const router = express.Router();

router
     .post('/', initializePayment)
     .get('/:reference', verifyPaymentRef)
     .post('/webhook', verifyPayment);


module.exports = router;
