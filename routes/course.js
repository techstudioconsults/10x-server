const express = require("express");
const router = express.Router();
// const upload = require("../middleware/multer");
const courseController = require("../controllers/courses");

// Route for creating a course with content
router.post("/courses", courseController.createCourse);

// Route for editing a course
router.put("/courses/:id", courseController.editCourse);

// Route for deleting a course
router.delete("/courses/:id", courseController.deleteCourse);

// Route for getting all courses
router.get("/courses", courseController.getAllCourses);

// Route for getting a single course by ID with its content
router.get("/courses/:id", courseController.getCourseById);

// Route for searching for courses
router.get("/courses/search", courseController.searchCourse);

//Route for getting recently uploaded courses
router.get("/recentCourse", courseController.getRecentlyUploadedCourses)

module.exports = router;