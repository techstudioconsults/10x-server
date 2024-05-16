const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a title for the content"],
    },
    file_url: {
      type: String,
      required: [true, "Please add a file URL for the content"],
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course", // Reference to Course model
      required: [true, "Please add a reference to the course"],
    },
  },
  { timestamps: true }
);

const ContentModel = mongoose.model("Content", contentSchema);

module.exports = { contentSchema, ContentModel };
