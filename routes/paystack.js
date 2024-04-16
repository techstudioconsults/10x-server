const express = require('express');
const { initializePayment} = require('../utils/paystack');
const whitelistIP = require('../middleware/whitelist');
const verifyPayment = require('../utils/verifyPayment');

const router = express.Router();


router
     .post('/', initializePayment)
     // .get('/:reference', verifyPayment)
     .post('/webhook', verifyPayment);


module.exports = router;