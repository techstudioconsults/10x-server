/**
 *  @author @AduragbemiShobowale Aduragbemi Shobowale
 *  @version 1.0
 */

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { addToWishList, removeFromWishList, getWishListCourses } = require('../controllers/wishList');

router.post('/add/:courseId', protect, addToWishList);
router.delete('/remove/:courseId', protect, removeFromWishList);
router.get('/', protect, getWishListCourses);

module.exports = router;
