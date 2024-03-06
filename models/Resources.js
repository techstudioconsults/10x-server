const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
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
    averageRating: {
        type: Number,
        min: [1, 'Rating must be at least 1'],
        max: [10, 'Rating can not be more than 10'],
    },
    photo: {
        type: String,
        required: [true, "add an image"],
        default: 'no-photo.jpg'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});


module.exports = mongoose.model('Resource', ResourceSchema);