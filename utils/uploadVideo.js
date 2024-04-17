// const Vimeo = require('vimeo').Vimeo;

// Initialize Vimeo client with your credentials
// const client = new Vimeo(`${process.env.CLIENT_ID }`, `${process.env.CLIENT_SECRET}`, `${process.env.ACCESS_TOKEN}`);

// // Function to upload a video to Vimeo
// async function uploadVideo(file_path, options) {
//     return new Promise((resolve, reject) => {
//         client.upload(
//             file_path,
//             options,
//             resolve, // Success callback
//             null, // No progress callback needed for now
//             reject // Error callback
//         );
//     });
// }

// module.exports = { uploadVideo };



// client.upload(
//   file_name,
//   {
//     'name': 'Untitled',
//     'description': 'The description goes here.'
//   },
//   function (uri) {
//     console.log('Your video URI is: ' + uri);
//   },
//   function (bytes_uploaded, bytes_total) {
//     var percentage = (bytes_uploaded / bytes_total * 100).toFixed(2)
//     console.log(bytes_uploaded, bytes_total, percentage + '%')
//   },
//   function (error) {
//     console.log('Failed because: ' + error)
//   }
// )