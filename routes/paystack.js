const express = require('express');
const { initializePayment, verifyPayment } = require('../utils/paystack');
const whitelistIP = require('../middleware/whitelist');
const webhook = require('../utils/helper');
const router = express.Router();


router
     .post('/', initializePayment)
     .get('/:reference', verifyPayment)
     .post('/webhook', webhook);


module.exports = router;