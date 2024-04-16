const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    title: String,
    file_url: String,
  },
  { timestamps: true }
);

const ContentModel = mongoose.model("Content", contentSchema);

module.exports = { contentSchema, ContentModel };
