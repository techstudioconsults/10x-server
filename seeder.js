/**
 *  @author @obajide028 Odesanya Babajide
 *  @version 1.0
 */
const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");

// Load env variables
dotenv.config({ path: "./config/.env" });

//Load models
const { CourseModel } = require("./models/Course");
const User = require("./models/User");

// Connect DB
mongoose.connect(process.env.MONGO_URI);

// Read JSON file
const course = JSON.parse(
  fs.readFileSync(`${__dirname}/data/course.json`, "utf-8")
);
const user = JSON.parse(
  fs.readFileSync(`${__dirname}/data/user.json`, "utf-8")
);

// Import into DB
const importData = async () => {
  try {
    await CourseModel.create(course);
    await User.create(user);
    console.log("Data Imported...".green.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

const deleteData = async () => {
  try {
    await CourseModel.deleteMany();
    await User.deleteMany();
    console.log("Data Destroyed...".red.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
