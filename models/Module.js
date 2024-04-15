const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a module title']
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    contents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Content'
    }]
});

module.exports = mongoose.model('Module', moduleSchema);
