const mongoose = require("mongoose");
const { contentSchema } = require("./Content");

const moduleSchema = new mongoose.Schema({
  
  
  },
  { timestamps: true }
);

const ModuleModel = mongoose.model("Module", moduleSchema);

module.exports = { moduleSchema, ModuleModel };
