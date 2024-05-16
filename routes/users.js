const express = require('express');
const { 
   getUsers,
   getUser,
   deleteUser
 } = require('../controllers/user');
 const User = require('../models/User');
 const advancedResult = require('../middleware/advancedResult');
 const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);


router
   .route('/')
   .get(advancedResult(User), authorize('admin'),  getUsers);

router
    .route('/:id')
    .get(authorize('admin'), getUser)
    .delete(authorize('admin', 'user'), deleteUser);
    
module.exports = router;