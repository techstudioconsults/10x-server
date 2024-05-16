const express = require('express');
const { initializePayment, verifyPaymentRef } = require('../services/paystack');
const whitelistIP = require('../middleware/whitelist');
const verifySignature = require('../middleware/verifySignature');

const { verifyWebhookEvent, getCourseUsers, getCoursesPaymentStats } = require('../controllers/payment');

const router = express.Router({ mergeParams: true });

router
     .post('/', initializePayment)
     .post('/webhook', whitelistIP, verifySignature, verifyWebhookEvent)
     .get('/total-earnings', getCoursesPaymentStats);

 router
    .route('/:id')
    .get(getCourseUsers)

module.exports = router;

