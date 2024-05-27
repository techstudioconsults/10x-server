/**
 *  @author @AduragbemiShobowale Aduragbemi Shobowale
 *  @version 1.0
 */

const mongoose = require('mongoose');

// Define Bookmark Schema
const wishListSchema = new mongoose.Schema(
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    },
    { timestamps: true }
  );


  module.exports = mongoose.model('WishList', wishListSchema);