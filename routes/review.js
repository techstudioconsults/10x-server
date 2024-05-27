const express = require('express');
const { getReviews, getReview, addReview, updateReview, deleteReview } = require('../controllers/review');
const Review = require('../models/Review');
const advancedResults = require('../middleware/advancedResult');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

router 
  .route('/')
  .get(advancedResults(Review, {
    path: 'course',
    select: 'title'
  }), getReviews)
  .post(protect, authorize('user', 'admin', 'super admin'), addReview);


router 
   .route('/:id')
   .get(getReview)
   .put(protect, authorize('user', 'admin', 'super admin'), updateReview)
   .delete(protect, authorize('user', 'admin', 'super admin'), deleteReview);

   module.exports = router;