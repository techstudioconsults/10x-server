const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a content title']
    },
    file_url: {
        type: String,
        required: [true, 'Please add a file URL']
    },
    module: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Module',
        required: true
    }
});

module.exports = mongoose.model('Content', contentSchema);
