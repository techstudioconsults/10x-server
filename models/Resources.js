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
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});