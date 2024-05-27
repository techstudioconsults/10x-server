/**
 *  @author @AduragbemiShobowale Aduragbemi Shobowale
 *  @version 1.0
 */

const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a title for the content"],
    },
    file: {
      type: String,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course", // Reference to Course model
      required: [true, "Please add a reference to the course"],
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DraftedCourse", // Reference to Course model
      required: [true, "Please add a reference to the course"],
    },
  },
  { timestamps: true }
);

const ContentModel = mongoose.model("Content", contentSchema);

module.exports = { contentSchema, ContentModel };
