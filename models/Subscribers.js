/**
 *  @author @obajide028 Odesanya Babajide
 *  @version 1.0
 */
const mongoose = require("mongoose");

const SubscriberSchema = mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
  },
});

module.exports = mongoose.model("Subscriber", SubscriberSchema);
