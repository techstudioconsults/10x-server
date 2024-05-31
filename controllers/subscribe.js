/**
 *  @author @obajide028 Odesanya Babajide
 *  @version 1.0
 */
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Subscriber = require("../models/Subscribers");
// const sendEmail = require('../utils/sendEmail');
const { mailSubscription, mailFreeAccess } = require("../utils/mailing");

//@desc     create subscribers
// @route   POST /api/v1/subscribe
// @access  Public
const createSubcribers = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  // Validate Email Address
  if (!email) {
    return res.status(400).json({ error: "Email address is required" });
  }

  // Check if email address already exist
  const existingSubscription = await Subscriber.findOne({ email });
  if (existingSubscription) {
    return res
      .status(400)
      .json({ error: "Email address is already subscribed" });
  }

  // Create a new subscriber
  const newSubscriber = await Subscriber.create({ email });

  // Prepare email template data
  const templateData = {
    email: req.body.email,
  };

  await mailSubscription({ email: templateData.email });

  return res
    .status(201)
    .json({ message: "Subscription successful", newSubscriber });
});

const unsubscribe = asyncHandler(async (req, res, next) => {
  try {
    const { email } = req.body;

    // Validate Email Address
    if (!email) {
      return res.status(400).json({ error: "Email address is required" });
    }

    // check if email exist
    const subscriberExist = await Subscriber.findOne({ email });
    if (!subscriberExist) {
      return res.status(400).json({ message: "subscriber does not exist" });
    }

    // if email exist
    await Subscriber.deleteOne({ email });
    res.status(200).json({ message: "Unsubscribed Successfully" });
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

const sendMailToSubscribers = asyncHandler(async (req, res, next) => {
  try {
    const { subject, message } = req.body;
    const subscribers = await Subscriber.find({}, { email: 1 });
    console.log(subscribers);

    // Send an email to each subscriber
    const send = subscribers.map(async (subscriber) => {
      const options = {
        email: subscriber.email,
        subject,
        message,
      };
      await sendEmail(options);
    });

    // Wait for all emails to be sent
    await Promise.all(subscribers);

    res.status(200).json({ message: "Emails sent successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const sendEmailToUser = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  // Validate Email Address
  if (!email) {
    return res.status(400).json({ error: "Email address is required" });
  }

  // Check if email address already exist
  const existingSubscription = await Subscriber.findOne({ email });
  if (existingSubscription) {
    return res
      .status(400)
      .json({ error: "Email address is already subscribed" });
  }

  // Create a new subscriber
  const newSubscriber = await Subscriber.create({ email });

  // Prepare email template data
  const templateData = {
    email: req.body.email,
  };

  await mailFreeAccess({ email: templateData.email });

  return res
    .status(201)
    .json({ message: "Subscription successful", newSubscriber });
});

module.exports = {
  createSubcribers,
  unsubscribe,
  sendMailToSubscribers,
  sendEmailToUser,
};
