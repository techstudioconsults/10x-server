/**
 *  @author @obajide028 Odesanya Babajide
 *  @version 1.0
 */
const asyncHandler = require("../middleware/async");
const User = require("../models/User");

//@desc     Get all users
// @route   GET /api/v1/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

//@desc     Get single user
// @route   GET /api/v1/users/:id
// @access  Private/Admin
const getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  res.status(200).json({ success: true, data: user });
});

//@desc   Delete user
// @route   DELETE /api/v1/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({ success: true, data: {} });
});

/**
 * @desc get User course
 *
 *  @access @private/user
 */

const getUserWithPurchasedCourse = asyncHandler(async (req, res, next) => {
  const userId = req.params.id || req.user._id;

  try {
    const user = await User.findById(userId).populate("purchasedCourses");

    if (!user) {
      return res
        .status(404)
        .json({
          success: false,
          message: `The User not found with id ${userId}`,
        });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
});

module.exports = { getUsers, getUser, deleteUser, getUserWithPurchasedCourse };
