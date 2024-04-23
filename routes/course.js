const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courses");

// Regular Courses
router.post("/regular", courseController.createRegularCourse);
router.put("/regular/:id", courseController.updateRegularCourse);
router.delete("/regular/:id", courseController.deleteRegularCourse);
router.get("/regular", courseController.getAllRegularCourses);
router.get(
  "/regular/search/:name",
  courseController.searchRegularCourseByTitle
);
router.get("/regular/:id", courseController.findRegularCourseById);

// Drafted Courses
router.post("/drafted", courseController.createDraftedCourse);
router.put("/drafted/:id", courseController.updateDraftedCourse);
router.delete("/drafted/:id", courseController.deleteDraftedCourse);
router.get("/drafted", courseController.getAllDraftedCourses);
router.get(
  "/drafted/search/:name",
  courseController.searchDraftedCourseByTitle
);
router.get("/drafted/:id", courseController.findDraftedCourseById);

module.exports = router;
