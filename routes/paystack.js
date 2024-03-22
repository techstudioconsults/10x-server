const express = require('express');
const { initializePayment, webhook, verifyPayment } = require('../utils/paystack');
const router = express.Router();


router
     .post('/', initializePayment)
     .get('/:reference', verifyPayment)
     .post('/webhook', webhook);


module.exports = router;