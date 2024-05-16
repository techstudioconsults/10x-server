const { CourseModel, WishListModel } = require("../models/Course");

// GET ALL WISHLIST ITEMS
const getWishListItems = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const wishListItems = await WishListModel.find({ user: userId }).populate(
      "course"
    );
    const wishedCourses = wishListItems.map((item) => item.course);
    res.status(200).json({ message: "success", data: wishedCourses });
  } catch (error) {
    next(error); // Pass error to error handling middleware
  }
};

// ADD ITEM TO WISHLIST
const addItemToWishList = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { courseId } = req.params;

    // Check if the course exists
    const course = await CourseModel.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ message: "No Course With The Provided ID" });
    }

    // Check if the item is already in the wishlist
    const existingItem = await WishListModel.findOne({
      user: userId,
      course: courseId,
    });
    if (existingItem) {
      return res
        .status(400)
        .json({ message: "Item already exists in the wishlist" });
    }

    // Create a new wishlist item
    const wishListItem = new WishListModel({ user: userId, course: courseId });
    await wishListItem.save();

    res.status(201).json({ message: "Item added to wishlist successfully" });
  } catch (error) {
    next(error); // Pass error to error handling middleware
  }
};

// REMOVE ITEM FROM WISHLIST
const removeItemFromWishList = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { courseId } = req.params;

    // Check if the course exists
    const course = await CourseModel.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ message: "No Course With The Provided ID" });
    }

    // Find and delete the wishlist item
    await WishListModel.findOneAndDelete({ user: userId, course: courseId });

    res
      .status(200)
      .json({ message: "Item removed from wishlist successfully" });
  } catch (error) {
    next(error); // Pass error to error handling middleware
  }
};

module.exports = {
  getWishListItems,
  addItemToWishList,
  removeItemFromWishList,
};