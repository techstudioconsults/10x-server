const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    User: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fullname: {
        type: String,
        required: [true, "Please add a fullname"],
        maxlength: [50, 'Name cannot be more than 50 characters']
    },
    email:{
        type: String,
        required: [true, "Please provide an email"],
        match: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          "Please add a valid email",
        ],
    },
    amount: {
        type: Number,
        required: true
    },
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
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