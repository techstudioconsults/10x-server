const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    text: {
        type: String,
    },
    rating: {
       type: Number,
       min: 1,
       max: 5,
    },
    resource: {
        type: mongoose.Schema.ObjectId,
        ref: 'Resource',
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
    
}, 
{
    timestamps: true
  } 

);

// Prevent user from submitting more than one review per bootcamp
ReviewSchema.index({ resource: 1, user: 1,}, { unique: true });


// Static method to get avg rating and save
ReviewSchema.statics.getAverageRating = async function(resourceId) {
    const obj = await this.aggregate([
        {
            $match: { resource: resourceId}
        },
        {
            $group: {
                _id: '$resource',
                averageRating: { $avg: '$rating' }
            }
        }
    ]);

    try {
        await this.model('Resource').findByIdAndUpdate(resourceId, {
            averageRating: obj[0].averageRating
        });
    } catch (error) {
        console.error(error);
    }
}

// getAverageCost after save
ReviewSchema.post('save', function(){
  this.constructor.getAverageRating(this.resource);
});

// getAverageCost befor remove
ReviewSchema.pre('remove', function(){
    this.constructor.getAverageRating(this.resource);
});


module.exports = mongoose.model('Review', ReviewSchema);