const fs = require("fs").promises;
const path = require("path");
const axios = require("axios");
const Vimeo = require("vimeo").Vimeo;

// Load Vimeo credentials from environment variables or a separate config file
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

const vimeoClient = new Vimeo(CLIENT_ID, CLIENT_SECRET, ACCESS_TOKEN);

const uploadVideoToVimeo = async (fileUrl) => {
  try {
    // Check if fileUrl is a local file path or a URL
    const isLocalPath = path.isAbsolute(fileUrl);

    if (isLocalPath) {
      // Upload local file to Vimeo
      const videoBuffer = await fs.readFile(fileUrl);
      const vimeoLink = await uploadFromBinary(videoBuffer);
      return vimeoLink;
    } else {
      // Treat fileUrl as a URL and upload to Vimeo
      const videoBuffer = await downloadVideoFromUrl(fileUrl);
      const vimeoLink = await uploadFromBinary(videoBuffer);
      return vimeoLink;
    }
  } catch (error) {
    console.error("Error uploading video to Vimeo:", error);
    throw error;
  }
};

const uploadFromBinary = async (videoBuffer) => {
  return new Promise((resolve, reject) => {
    const videoSize = videoBuffer.length; // Get video size
    console.log("Video Size (bytes):", videoSize);

    // Ensure videoSize is an integer before adding to payload
    const payloadSize = parseInt(videoSize, 10);

    // Construct the request payload
    const payload = {
      name: "Video Title",
      description: "Video Description",
      upload: {
        size: payloadSize,
      },
    };
    console.log("Request Payload:", JSON.stringify(payload, null, 2));

    vimeoClient.upload(
      videoBuffer,
      payload,
      function (uri) {
        const vimeoUrl = `https://vimeo.com/${uri.split("/").pop()}`;
        resolve(vimeoUrl);
      },
      function (bytes_uploaded, bytes_total) {
        console.log(bytes_uploaded, bytes_total);
      },
      function (error) {
        console.log("Failed to upload video:", error);
        reject(error);
      }
    );
  });
};

const downloadVideoFromUrl = async (videoUrl) => {
  try {
    const response = await axios.get(videoUrl, { responseType: "arraybuffer" });
    return Buffer.from(response.data, "binary");
  } catch (error) {
    throw new Error("Failed to download video");
  }
};

module.exports = { uploadVideoToVimeo };
