const express = require('express');
const { createSubcribers, unsubscribe } = require('../controllers/subscribe');
 const advancedResult = require('../middleware/advancedResult');
 const { protect, authorize } = require('../middleware/auth');


const router = express.Router();

router.post('/createsubscriber', createSubcribers);
router.delete('/unsubscriber', unsubscribe);



module.exports = router;