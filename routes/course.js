const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courses");

// Create a regular or draft course
router.post("/courses", courseController.createCourse);

// Update a regular or draft course
router.put("/courses/:id", courseController.updateCourse);

// Delete regular course by ID
router.delete('/regular/:id', courseController.deleteRegularCourse);

// Delete drafted course by ID
router.delete('/draft/:id', courseController.deleteDraftedCourse);

// Get all regular courses
router.get("/courses/regular", courseController.getAllRegularCourses);

// Get all draft courses
router.get("/courses/draft", courseController.getAllDraftCourses);

// Search regular courses by title
router.get(
  "/courses/regular/search/:title",
  courseController.searchRegularCourseByTitle
);

// Route to find a single regular course by ID
router.get("/courses/regular/:id", courseController.findRegularCourseById);

// Route to find a single draft course by ID
router.get("/courses/draft/:id", courseController.findDraftCourseById);

// Search draft courses by title
router.get(
  "/courses/draft/search/:title",
  courseController.searchDraftCourseByTitle
);

module.exports = router;
