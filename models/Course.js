const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "Please add a course title"],
    },
    courseDescription: {
      type: string,
      required: [true, "Please add a course description"],
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
    modules: [{ type: mongoose.Schema.Types.ObjectId, ref: "Module" }],
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
    courseDescription: {
      type: string,
      required: [true, "Please add a course description"],
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
    modules: [{ type: mongoose.Schema.Types.ObjectId, ref: "Module" }],
  },
  { timestamps: true }
);

const CourseModel = mongoose.model("Course", courseSchema);
const DraftedCourseModel = mongoose.model("DraftCourse", draftCourseSchema);

module.exports = { CourseModel, DraftedCourseModel };
