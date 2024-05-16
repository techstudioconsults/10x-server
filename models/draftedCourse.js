const mongoose = require("mongoose");

// Define Drafted Course Schema
const draftCourseSchema = new mongoose.Schema(
  {
    courseTitle: {
      type: String,
      trim: true,
      required: [true, "Please add a course title"],
    },
    courseDescription: {
      type: String,
      required: [true, "Please add a course description"],
    },
    price: {
      type: Number,
      required: [true, "Please add a tuition cost"],
    },
    courseCategory: {
      type: String,
      enum: ["video", "book"],
      required: [true, "Please add a category"],
    },
    thumbnail: {
      type: String,
      required: [true, "Add an image"],
      default: "no-photo.jpg",
    },
    status: {
      type: String,
      default: "draft",
    },
    content: [{ type: mongoose.Schema.Types.ObjectId, ref: "Content" }],
  },
  { timestamps: true }
);

const DraftedCourseModel = mongoose.model("DraftedCourse", draftCourseSchema);

module.exports = { DraftedCourseModel };
