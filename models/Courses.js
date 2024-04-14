const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
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
        required: [true, 'Please add a category'],
        enum: ['pdf', 'video'],
    },
    photo: {
        type: String,
        required: [true, 'Please add an image'],
        default: 'no-photo.jpg'
    },
    modules: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Module'
    }]
});

module.exports = mongoose.model('Course', courseSchema);
