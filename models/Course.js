/**
 *  @author @AduragbemiShobowale  Aduragbemi Shobowale
 *  @version 1.0
 */
const mongoose = require("mongoose");

// Define Course Schema
const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "Please add a course title"],
    },
    description: {
      type: String,
      required: [true, "Please add a course description"],
    },
    price: {
      type: String,
      required: [true, "Please add a tuition cost"],
    },
    category: {
      type: String,
      enum: ["video", "book"],
      required: [true, "Please add a category"],
    },
    url: {
      type: String,
      required: [false, "Please add a valid URL"],
    },
    thumbnail: {
      type: String,
      required: [true, "Add an image"],
      default:
        "https://res.cloudinary.com/dgde8cwjk/image/upload/v1717083432/default-avatar-profile-icon-vector-18942381_uvoj7c.jpg",
    },
    status: {
      type: String,
      enum: ["drafted", "published"],
      default: "published",
    },
  },
  { timestamps: true }
);

const CourseModel = mongoose.model("Course", courseSchema);

module.exports = { CourseModel };
