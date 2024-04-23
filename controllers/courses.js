const { RegularCourseModel, DraftedCourseModel } = require("../models/Course");
const { uploadVideoToVimeo } = require("./vimeoUploader");

// Create a regular course
exports.createRegularCourse = async (req, res) => {
  try {
    const courseData = req.body;

    // Iterate through modules and contents to upload videos to Vimeo
    for (const module of courseData.modules) {
      for (const content of module.content) {
        if (content.file_url) {
          content.file_url = await uploadVideoToVimeo(content.file_url);
        }
      }
    }

    const regularCourse = new RegularCourseModel({
      ...courseData,
      draft: false,
    });
    await regularCourse.save();
    res.status(201).json(regularCourse);
  } catch (error) {
    res.status(500).json({ error: "Failed to create regular course" });
    console.log(error);
  }
};

// Create a drafted course
exports.createDraftedCourse = async (req, res) => {
  try {
    const courseData = req.body;

    // Iterate through modules and contents to upload videos to Vimeo
    for (const module of courseData.modules) {
      for (const content of module.content) {
        if (content.file_url) {
          content.file_url = await uploadVideoToVimeo(content.file_url);
        }
      }
    }

    const draftedCourse = new DraftedCourseModel({
      ...courseData,
      draft: true,
    });
    await draftedCourse.save();
    res.status(201).json(draftedCourse);
  } catch (error) {
    res.status(500).json({ error: "Failed to create drafted course" });
  }
};

// Update a regular course
exports.updateRegularCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const updatedCourse = await RegularCourseModel.findByIdAndUpdate(
      courseId,
      req.body,
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ error: "Regular course not found" });
    }

    res.json(updatedCourse);
  } catch (error) {
    res.status(500).json({ error: "Failed to update regular course" });
  }
};

// Update a drafted course
exports.updateDraftedCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const updatedCourse = await DraftedCourseModel.findByIdAndUpdate(
      courseId,
      req.body,
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).json({ error: "Drafted course not found" });
    }

    res.json(updatedCourse);
  } catch (error) {
    res.status(500).json({ error: "Failed to update drafted course" });
  }
};

// Delete a regular course
exports.deleteRegularCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const deletedCourse = await RegularCourseModel.findByIdAndDelete(courseId);
    if (!deletedCourse) {
      console.log(`Regular course with ID ${courseId} not found.`);
      return res.status(404).json({ error: "Regular course not found" });
    }

    res.json({ message: "Regular course deleted successfully" });
  } catch (error) {
    console.error("Error deleting regular course:", error);
    res.status(500).json({ error: "Failed to delete regular course" });
  }
};

// Delete a drafted course
exports.deleteDraftedCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const deletedCourse = await DraftedCourseModel.findByIdAndDelete(courseId);
    if (!deletedCourse) {
      console.log(`Drafted course with ID ${courseId} not found.`);
      return res.status(404).json({ error: "Drafted course not found" });
    }

    res.json({ message: "Drafted course deleted successfully" });
  } catch (error) {
    console.error("Error deleting drafted course:", error);
    res.status(500).json({ error: "Failed to delete drafted course" });
    console.log(error);
  }
};

// Get all regular courses
exports.getAllRegularCourses = async (req, res) => {
  try {
    const regularCourses = await RegularCourseModel.find({ draft: false });
    res.json(regularCourses);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch regular courses" });
  }
};

// Get all drafted courses
exports.getAllDraftedCourses = async (req, res) => {
  try {
    const draftedCourses = await DraftedCourseModel.find();
    res.json(draftedCourses);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch drafted courses" });
  }
};

// Search regular courses by title
exports.searchRegularCourseByTitle = async (req, res) => {
  try {
    const { title } = req.query;
    const regularCourses = await RegularCourseModel.find({
      title: { $regex: new RegExp(title, "i") },
      draft: false,
    });
    res.json(regularCourses);
  } catch (error) {
    res.status(500).json({ error: "Failed to search for regular courses" });
  }
};

// Search drafted courses by title
exports.searchDraftedCourseByTitle = async (req, res) => {
  try {
    const { title } = req.query;
    const draftedCourses = await DraftedCourseModel.find({
      title: { $regex: new RegExp(title, "i") },
    });
    res.json(draftedCourses);
  } catch (error) {
    res.status(500).json({ error: "Failed to search for drafted courses" });
  }
};

// Find regular course by ID
exports.findRegularCourseById = async (req, res) => {
  try {
    const courseId = req.params.id;
    const regularCourse = await RegularCourseModel.findById(courseId);

    if (!regularCourse || regularCourse.draft) {
      return res.status(404).json({ error: "Regular course not found" });
    }

    res.json(regularCourse);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch regular course" });
  }
};

// Find drafted course by ID
exports.findDraftedCourseById = async (req, res) => {
  try {
    const courseId = req.params.id;
    const draftedCourse = await DraftedCourseModel.findById(courseId);

    if (!draftedCourse) {
      return res.status(404).json({ error: "Drafted course not found" });
    }

    res.json(draftedCourse);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch drafted course" });
  }
};
