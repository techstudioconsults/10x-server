/**
 *  @author @AduragbemiShobowale  Aduragbemi Shobowale
 *  @version 1.0
 */
const express = require("express");
const router = express.Router();
const draftedCourseController = require("../controllers/draftedCourses");
const { authorize, protect } = require("../middleware/auth");

// Route for creating a drafted course with content
router.post(
  "/",
  protect,
  authorize("admin", "super admin"),
  draftedCourseController.createDraftedCourse
);

// Route for editing a drafted course
router.put(
  "/:id",
  protect,
  authorize("admin", "super admin"),
  draftedCourseController.updateDraftedCourse
);

// Route for deleting a drafted course
router.delete(
  "/:id",
  protect,
  authorize("admin", "super admin"),
  draftedCourseController.deleteDraftedCourse
);

// Route for getting all drafted courses
router.get("/", draftedCourseController.getDraftedCourses);

// Route for getting a single drafted course by ID
router.get("/:id", draftedCourseController.getDraftedCourse);

// Route for searching for drafted courses dynamically by keyword
router.get("/search/:keyword", draftedCourseController.searchDraftedCourses);

module.exports = router;
