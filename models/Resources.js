const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please add a course title']
    },
    price: {
        type: Number,
        required: [true, 'Pleasea add a tuition cost']
    },
    category: {
        type: String,
        required: [true, "Please add a category"],
        enum: ['pdf', 'video'],
    },
    photo: {
        type: String,
        required: [true, "add an image"],
        default: 'no-photo.jpg'
    }
},
  {
    timestamps: true
  } 
);


module.exports = mongoose.model('Resource', ResourceSchema);