const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    text: {
      type: String,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    course: {
      type: mongoose.Schema.ObjectId,
      ref: "Course",
      required: true,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent user from submitting more than one review per course
ReviewSchema.index({ course: 1, user: 1 }, { unique: true });

// Static method to get avg rating and save
ReviewSchema.statics.getAverageRating = async function (courseId) {
  const obj = await this.aggregate([
    {
      $match: { course: courseId },
    },
    {
      $group: {
        _id: "$course",
        averageRating: { $avg: "$rating" },
      },
    },
  ]);

  try {
    await this.model("Course").findByIdAndUpdate(courseId, {
      averageRating: obj[0].averageRating,
    });
  } catch (error) {
    console.error(error);
  }
};

// getAverageCost after save
ReviewSchema.post("save", function () {
  this.constructor.getAverageRating(this.course);
});

// getAverageCost befor remove
ReviewSchema.pre("remove", function () {
  this.constructor.getAverageRating(this.course);
});

module.exports = mongoose.model("Review", ReviewSchema);
