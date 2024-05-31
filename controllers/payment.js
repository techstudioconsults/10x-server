/**
 *  @author @obajide028 Odesanya Babajide
 *  @version 1.0
 */
const User = require("../models/User");
const PaymentDetails = require("../models/Payment");
const asyncHandler = require("../middleware/async");
const { CourseModel } = require("../models/Course");
const { welcomeMail } = require("../utils/mailing");
const { initializePayment } = require("../services/paystack");

//verify transaction using webhook
const verifyWebhookEvent = asyncHandler(async (req, res) => {
  try {
    const payload = req.body;

    // helper function to process payment success
    const processPaymentSuccess = async (data) => {
      const customerEmail = data.customer.email;
      const customerReference = data.reference;

      const payment = await PaymentDetails.findOne({
        reference: customerReference,
      });

      if (!payment) {
        return res.status(404).json({ message: "Payment record not found" });
      }

      // check if the payment has already been purchased
      if (payment.used) {
        return res
          .status(400)
          .json({ message: "Payment has already been processed" });
      }
      //update payment status to success
      payment.status = "success";
      payment.used = true;
      await payment.save();

      // Find the user by email
      const user = await User.findOne({ email: customerEmail });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Find the course by ID
      const course = await CourseModel.findById(payment.courseId);
      console.log(payment.courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      // Associate the course with the user
      if (!user.purchasedCourses.includes(course._id)) {
        await user.purchasedCourses.push(course._id);
        await user.save();
      }

      // Check if the user is new
      const isNewUser = user.isNewUser;

      // Send welcome email only if it's the first purchase
      if (isNewUser) {
        const templateData = {
          fullname: payment.fullname,
          email: customerEmail,
        };

        await welcomeMail({
          fullname: templateData.fullname,
          email: templateData.email,
        });

        // Set isNewUser to false after sending the welcome email
        user.isNewUser = false;
        await user.save();
      }

      return res
        .status(200)
        .json({ message: "webhook!!!!", customerReference });
    };

    let responseMessage;
    // Check for transaction success
    if (
      payload.event === "charge.success" ||
      payload.event === "transfer.success"
    ) {
      responseMessage = await processPaymentSuccess(payload.data);
    }

    // check if transfer failed
    if (payload.event == "transfer.failed") {
      const { data } = payload;
      const customerEmail = data.customer.email;
      const customerReference = data.reference;

      // find the user by email
      const user = await User.findOne({ email: customerEmail });
      if (!user) {
        console.error(`User not found for email: ${customerEmail}`);
        return res.status(404).json({ message: "User not found" });
      }

      // check if the user is a new user
      if (user.isNewUser) {
        // Remove the new user and their payment details
        await user.remove();

        const payment = await PaymentDetails.findOne({
          reference: customerReference,
        });
        if (payment) {
          await payment.remove();
        }

        responseMessage = {
          message: "Payment failed for existing user",
          customerEmail,
          customerReference,
        };
      }

      res.status(200).json({ message: responseMessage });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

const getCourseUsers = asyncHandler(async (req, res, next) => {
  const courseId = req.params.id;
  if (req.user.role !== "admin" && req.user.role !== "super admin") {
    return res.status(401).json({
      success: false,
      message: `User ${req.user.id} is not authorized to add course`,
    });
  }
  const userDetails = await PaymentDetails.find({
    courseId: courseId,
    status: "success",
  });

  const totalAmount = userDetails.reduce((sum, doc) => sum + doc.amount, 0);

  res.status(200).json({
    count: userDetails.length,
    data: userDetails,
    totalAmount,
  });
});

const getCoursesPaymentStats = asyncHandler(async (req, res, next) => {
  try {
    if (req.user.role !== "admin" && req.user.role !== "super admin") {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to add course`,
      });
    }
    const paymentStats = await PaymentDetails.aggregate([
      { $match: { status: "success" } }, // Filter for successful payments
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          totalAmount: { $sum: "$amount" },
        },
      }, // Group and calculate totals
    ]);

    if (paymentStats.length === 0) {
      return res.status(404).json({ message: "No payment details found" });
    }

    const { totalUsers, totalAmount } = paymentStats[0];

    //get total courses
    const totalCourses = await CourseModel.find();

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalAmount,
        totalCourses: totalCourses.length,
      },
    });
  } catch (error) {
    next(error);
  }
});

const purchaseCourse = asyncHandler(async (req, res, next) => {
  const { userId, courseId, amount, email } = req.body;
  try {
    //find the user and the course
    const user = await User.findById(userId);
    console.log(user);
    const course = await CourseModel.findById(courseId);
    console.log(course);

    // check if the user already purchased the course
    if (user.purchasedCourses && user.purchasedCourses.includes(courseId)) {
      return res.status(400).json({
        success: false,
        message: "You have already purchased this course",
      });
    }

    const paymentData = await initializePayment(req);

    // Create a new payment record with pending status
    const payment = await PaymentDetails.create({
      user: userId,
      amount,
      courseId,
      fullname: user.fullname,
      email,
      reference: paymentData.data.reference,
      status: "pending",
    });

    await payment.save();

    // Send the payment data as a response
    res.status(200).json({
      success: true,
      data: paymentData,
    });
  } catch (error) {
    console.error("Error during course purchase: ", error);
    res.status(500).json({ error: "An error occurred during course purchase" });
  }
});

module.exports = {
  verifyWebhookEvent,
  getCourseUsers,
  getCoursesPaymentStats,
  purchaseCourse,
};
