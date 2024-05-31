/**
 *  @author @AduragbemiShobowale  Aduragbemi Shobowale
 *  @version 1.0
 */

const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAMES,
  api_key: process.env.CLOUDINARY_API_KEYS,
  api_secret: process.env.CLOUDINARY_API_SECRETS,
});

const uploadVideo = async (filePath, resourceType = "auto") => {
  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        filePath,
        {
          resource_type: resourceType,
          type: "authenticated",
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
