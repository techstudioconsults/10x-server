/**
 *  @author @obajide028 Odesanya Babajide
 *  @version 1.0
 */
const express = require('express');
const { initializePayment } = require('../services/paystack');
const whitelistIP = require('../middleware/whitelist');
const verifySignature = require('../middleware/verifySignature');
const { verifyWebhookEvent, getCourseUsers, getCoursesPaymentStats, purchaseCourse } = require('../controllers/payment');
const { authorize, protect } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

router
     .post('/purchasecourse', protect, purchaseCourse)
     .post('/', initializePayment)
     .post('/webhook', whitelistIP, verifySignature, verifyWebhookEvent)
     .get('/total-earnings', protect, authorize('admin', 'super admin'), getCoursesPaymentStats);

 router
    .route('/:id')
    .get(protect, authorize('admin', 'super admin'), getCourseUsers)

module.exports = router;

