const mongoose = require("mongoose");
const { contentSchema } = require("./Content");

const moduleSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId, 
    title: String,
    content: [contentSchema],
  },
  { timestamps: true }
);

const ModuleModel = mongoose.model("Module", moduleSchema);

module.exports = { moduleSchema, ModuleModel };
