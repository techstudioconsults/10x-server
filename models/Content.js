// Content schema
const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema(
  {
    title: String,
    description: String, 
    file_url: String,
    moduleId: { type: mongoose.Schema.Types.ObjectId, ref: "Module" }, // Reference to Module model
  },
  { timestamps: true }
);

const ContentModel = mongoose.model("Content", contentSchema);

module.exports = { contentSchema, ContentModel };
