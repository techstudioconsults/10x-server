const express = require('express');
const { initializePayment,verifyPayment } = require('../utils/paystack');
const webhook = require('../utils/helper');
const whitelistIP = require('../middleware/whitelist');
const router = express.Router();


router
     .post('/', initializePayment)
     .get('/:reference', verifyPayment)
     .post('/webhook', webhook);


module.exports = router;