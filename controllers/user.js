const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User'); 



//@desc     Get all users
// @route   GET /api/v1/users
// @access  Private/Admin
const getUsers = asyncHandler(async(req, res, next) => {
   res.status(200).json(res.advancedResults);
});


//@desc     Get single user
// @route   GET /api/v1/users/:id
// @access  Private/Admin
const getUser = asyncHandler(async(req, res, next) => {
    const user = await User.findById(req.params.id);
   
    res.status(200).json({ success: true, data: user });
 });



  //@desc   Delete user
// @route   DELETE /api/v1/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async(req, res, next) => {
   const user = await User.findByIdAndDelete(req.params.id)
   
   res.status(200).json({ success: true, data: {}});
});


module.exports = { getUsers, getUser, deleteUser }