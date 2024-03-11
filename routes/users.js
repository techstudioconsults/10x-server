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
router.use(authorize('admin'));

router
   .route('/')
   .get(advancedResult(User),  getUsers);

router
    .route('/:id')
    .get(getUser)
    .delete(deleteUser);
    
module.exports = router;