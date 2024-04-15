const Course = require('../models/Course');
const Module = require('../models/Module');
const Content = require('../models/Content');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const { uploadVideo } = require('../utils/uploadVideo'); 
const uploadImage = require('../utils/uploadImage'); 


// @desc    Create a new course with modules and contents
// @route   POST /api/courses
// @access  Private (assuming authentication is required)
exports.createCourse = asyncHandler(async (req, res, next) => {
    // Extract data from request body
    const { title, price, category, photo, modules } = req.body;

    // Create an array to hold module objects
    const createdModules = [];

    // Iterate over modules array and create module documents
    for (const moduleData of modules) {
        // Extract module data from moduleData object
        const { title: moduleTitle, contents } = moduleData;

        // Create a new module instance
        const module = await Module.create({ title: moduleTitle });

        // Create an array to hold content objects for the module
        const createdContents = [];

        // Iterate over contents array and create content documents
        for (const contentData of contents) {
            // Extract content data from contentData object
            const { title: contentTitle, video_path } = contentData;

            // Upload the video to Vimeo
            const videoUri = await uploadVideo(video_path, {
                name: contentTitle,
                description:''
            });

            // Create a new content instance with the Vimeo video URI
            const content = await Content.create({ title: contentTitle, file_url: videoUri, module: module._id });

            // Push the created content into the array
            createdContents.push(content._id);
        }

        // Set the contents field of the module to the array of created contents
        module.contents = createdContents;

        // Save the module document
        await module.save();

        // Push the created module into the array
        createdModules.push(module._id);
    }

    // Create a new course instance with the created modules
    const course = await Course.create({
        title,
        price,
        category,
        photo,
        modules: createdModules
    });

    // Send a success response with the created course data
    res.status(201).json({ success: true, data: course });
});
