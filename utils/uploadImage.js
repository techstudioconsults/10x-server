const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
});

const opts = {
    overwrite: true,
    invalidate: true,
    resource_type: "auto",
  };

  const uploadImage = async(image) => {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await cloudinary.uploader.upload(image, opts);
             if(result && result.secure_url){
                console.log(result.secure_url);
                resolve(result.secure_url);
             } else {
                console.log("Error uploading image");
                reject({ message: "Error uploading image" });
              }
        } catch (error) {
            console.log(error.message);
            reject({ message: error.message });
        }
    });
  }


  module.exports = uploadImage;