const mongoose = require("mongoose");

// Define the course schema with common fields
const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, "Please add a course title"],
    },
    price: {
      type: Number,
      required: [true, "Please add a tuition cost"],
    },
    category: {
      type: String,
      required: [true, "Please add a category"],
      enum: ["pdf", "video"],
    },
    draft: { type: Boolean, default: false }, // Default to false
    photo: {
      type: String,
      required: [true, "Please add an image"],
      default: "no-photo.jpg",
    },
    modules: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Module",
      },
    ],
  },
  { timestamps: true }
); // Include timestamps for course

// Create a discriminator for drafted courses
const DraftedCourseModel = mongoose.model(
  "DraftedCourse",
  courseSchema.discriminator(
    "DraftedCourse",
    new mongoose.Schema({ draft: { type: Boolean, default: true } })
  )
);

module.exports = {
  CourseModel: mongoose.model("Course", courseSchema),
  DraftedCourseModel,
};
