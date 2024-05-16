const express = require("express");
const router = express.Router();
// const upload = require("../middleware/multer");
const courseController = require("../controllers/courses");
const { authorize, protect } = require("../middleware/auth");

// Route for creating a course with content
router.post(
  "/courses",
  protect,
  authorize("admin", "super admin"),
  courseController.createCourse
);

// Route for editing a course
router.put(
  "/courses/:id",
  protect,
  authorize("admin", "super admin"),
  courseController.editCourse
);

// Route for deleting a course
router.delete(
  "/courses/:id",
  protect,
  authorize("admin", "super admin"),
  courseController.deleteCourse
);

// Route for getting all courses
router.get("/courses", courseController.getAllCourses);

// Route for getting a single course by ID with its content
router.get("/courses/:id", courseController.getCourseById);

// Route for searching for courses
router.get("/courses/search", courseController.searchCourse);

//Route for getting recently uploaded courses
router.get("/recentCourse", courseController.getRecentlyUploadedCourses);

module.exports = router;
