const mongoose = require("mongoose");
const { moduleSchema } = require("./Module");

const regularCourseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "Please add a course title"],
    },
    amount: {
      type: Number,
      required: [true, "Please add a tuition cost"],
    },
    category: {
      type: String,
      enum: ["video", "book"],
      required: [true, "Please add a category"],
    },
    uploadThumbnail: {
      type: String,
      required: [true, "Please add an image"],
      default: "no-photo.jpg",
    },
    draft: { type: Boolean, default: false },
    modules: [moduleSchema],
  },
  { timestamps: true }
);

const draftCourseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "Please add a course title"],
    },
    amount: {
      type: Number,
      required: [true, "Please add a tuition cost"],
    },
    category: {
      type: String,
      enum: ["video", "book"],
      required: [true, "Please add a category"],
    },
    uploadThumbnail: {
      type: String,
      required: [true, "Please add an image"],
      default: "no-photo.jpg",
    },
    draft: { type: Boolean, default: true },
    modules: [moduleSchema],
  },
  { timestamps: true }
);

const RegularCourseModel = mongoose.model("RegularCourse", regularCourseSchema);
const DraftedCourseModel = mongoose.model("DraftCourse", draftCourseSchema);

module.exports = { RegularCourseModel, DraftedCourseModel };
