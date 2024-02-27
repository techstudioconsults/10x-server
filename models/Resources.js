const mongoose = require('mongoose');


const ResourceSchema = new mongoose.Schema({
    title: {
        type: String,

    },
    contentType: {
        type: String,
        required: true
     },
})