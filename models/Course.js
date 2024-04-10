const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema(
  {
    title: String,
    file_url: String,
  },
  { timestamps: true }
); // Include timestamps for content

const moduleSchema = new mongoose.Schema(
  {
    title: String,
    content: [contentSchema],
  },
  { timestamps: true }
); // Include timestamps for modules

const regularCourseSchema = new mongoose.Schema(
  {
    title: String,
    amount: Number,
    category: { type: String, enum: ["video", "book"] },
    uploadThumbnail: String,
    draft: { type: Boolean, default: false }, // Default to false
    modules: [moduleSchema],
  },
  { timestamps: true }
);

const draftCourseSchema = new mongoose.Schema(
  {
    title: String,
    amount: Number,
    category: { type: String, enum: ["video", "book"] },
    uploadThumbnail: String,
    draft: { type: Boolean, default: true },
    modules: [moduleSchema],
  },
  { timestamps: true }
); // Include timestamps for draft courses

const RegularCourseModel = mongoose.model("RegularCourse", regularCourseSchema);
const DraftCourseModel = mongoose.model("DraftCourse", draftCourseSchema);

module.exports = { RegularCourseModel, DraftCourseModel };
