const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAMES,
  api_key: process.env.CLOUDINARY_API_KEYS,
  api_secret: process.env.CLOUDINARY_API_SECRETS,
});

const uploadVideo = async (filePath) => {
  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_large(
        filePath,
        {
          resource_type: "video", // Auto-detect the resource type
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result.secure_url); // Return the secure URL of the uploaded file
          }
        }
      );
    });
    return result;
  } catch (error) {
    throw error;
  }
};

module.exports = uploadVideo;
