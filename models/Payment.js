const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    courseId: {
        type: String,
        required: true
    },
    reference: {
        type: String,
        unique: true
    },
    status:{
        type: String,
        enum: ['pending', 'success', 'failed'],
        default: 'pending'
    },
    paymentDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Payment", paymentSchema);