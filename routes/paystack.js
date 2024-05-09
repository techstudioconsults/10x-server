const express = require('express');
const { initializePayment, verifyPaymentRef } = require('../services/paystack');
const whitelistIP = require('../middleware/whitelist');
const verifySignature = require('../middleware/verifySignature');

const { verifyWebhookEvent, getCourseUsersDetails, getUserById } = require('../controllers/payment');

const router = express.Router({ mergeParams: true });

router
     .post('/', initializePayment)
     .get('/:reference', verifyPaymentRef)
     .post('/webhook',whitelistIP, verifySignature, verifyWebhookEvent)

 router
     .route('/:id')
     .get(getCourseUsersDetails)

module.exports = router;

