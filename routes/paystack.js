const express = require('express');
const { initializePayment, webhook, verifyPayment } = require('../utils/paystack');
const whitelistIP = require('../middleware/whitelist');
const router = express.Router();


router
     .post('/', initializePayment)
     .get('/:reference', verifyPayment)
     .post('/webhook', whitelistIP, webhook);


module.exports = router;