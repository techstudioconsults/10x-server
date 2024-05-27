/**
 *  @author @AduragbemiShobowale Aduragbemi Shobowale
 *  @version 1.0
 */

const express = require("express");
const router = express.Router();
// const upload = require("../middleware/multer");
const draftedCourseController = require("../controllers/draftedCourses");
const { authorize, protect } = require("../middleware/auth");

// Route for creating a course with content
router.post(
  "/",
  protect,
  authorize("admin", "super admin"),
  draftedCourseController.createDraftCourse
);

// Route for editing a course
router.put(
  "/:id",
  protect,
  authorize("admin", "super admin"),
  draftedCourseController.editDraftedCourse
);

// Route for deleting a course
router.delete(
  "/:id",
  protect,
  authorize("admin", "super admin"),
  draftedCourseController.deleteDraftedCourse
);

// Route for getting all courses
router.get("/", draftedCourseController.getAllDraftedCourses);

// Route for getting a single course by ID with its content
router.get("/:id", draftedCourseController.getDraftedCourseById);

// Route for searching for courses
router.get("/search/:keyword", draftedCourseController.searchDraftedCourse);

authorize("admin", "super admin"), (module.exports = router);
