const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    user: {
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

// Static method to get total amount
paymentSchema.statics.getTotalAmount = async function(courseId) {
    const result = await this.aggregate([
      { $match: { courseId: mongoose.Types.ObjectId(courseId), status: 'success' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
  
    // result is an array with one object if there are payments, or empty if no payments were found
    return result.length > 0 ? result[0].total : 0;
  };


module.exports = mongoose.model("Payment", paymentSchema);