// Module schema
const mongoose = require("mongoose");

const moduleSchema = new mongoose.Schema(
  {
    title: String,
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" }, // Reference to Course model
    contents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Content" }] // Reference to Content model
  },
  { timestamps: true }
);

const ModuleModel = mongoose.model("Module", moduleSchema);

module.exports = { moduleSchema, ModuleModel };
