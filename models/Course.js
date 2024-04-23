const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please add a course title']
    },
    price: {
        type: Number,
        required: [true, 'Please add a tuition cost']
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
    },
    detail:{
        type: String,
        required: [true, "Please add a detail"]
    },
    description: {
        type: String,
        required: [true, "Please add a description"]
    }
},
  {
    timestamps: true
  } 
);


module.exports = mongoose.model('Course', CourseSchema);