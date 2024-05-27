const User = require("../models/User");

// @desc    Add course to wish list
// @route   POST /api/v1/wishlist/add/:courseId
// @access  Private
exports.addToWishList = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    if (user.wishList.includes(req.params.courseId)) {
      return res
        .status(400)
        .json({ success: false, error: "Course already in wish list" });
    }

    user.wishList.push(req.params.courseId);
    await user.save();

    res.status(200).json({ success: true, data: user.wishList });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Remove course from wish list
// @route   DELETE /api/v1/wishlist/remove/:courseId
// @access  Private
exports.removeFromWishList = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    if (!user.wishList.includes(req.params.courseId)) {
      return res
        .status(400)
        .json({ success: false, error: "Course not in wish list" });
    }

    user.wishList.pull(req.params.courseId);
    await user.save();

    res.status(200).json({ success: true, data: user.wishList });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get all courses in wish list
// @route   GET /api/v1/wishlist
// @access  Private
exports.getWishListCourses = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('wishList');
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.status(200).json({ success: true, data: user.wishList });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
