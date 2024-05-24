const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { addToWishList, removeFromWishList, getWishListCourses } = require('../controllers/wishList');

router.post('/wishlist/add/:courseId', protect, addToWishList);
router.delete('/wishlist/remove/:courseId', protect, removeFromWishList);
router.get('/wishlist', protect, getWishListCourses);

module.exports = router;
