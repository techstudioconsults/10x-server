/**
 *  @author @obajide028 Odesanya Babajide
 *  @version 1.0
 */
const User = require("../models/User");
const PaymentDetails = require("../models/Payment");
const asyncHandler = require("../middleware/async");
const { CourseModel } = require("../models/Course");
const { welcomeMail } = require("../utils/mailing");

//verify transaction using webhook
const verifyWebhookEvent = asyncHandler(async (req, res) => {
  try {
    const payload = req.body;

    // check for transaction success
    if (payload.event == "charge.success") {
      const { data } = payload;
      const customerEmail = data.customer.email;

      const customerReference = data.reference;
      const fieldsToUpdate = {
        status: "success",
      };

      //update payment status
      await PaymentDetails.findOneAndUpdate(
        { reference: customerReference },
        fieldsToUpdate,
        {
          new: true,
          runValidators: true,
        }
      );

      // Find the user by email
      const user = await User.findOne({ email: customerEmail });
      if (user) {
        // Find the course by id
        const payment = await PaymentDetails.findOne({ email: customerEmail });

        const course = await CourseModel.findById(payment.courseId);
        console.log(course);
        if (course) {
          // Associate the course with the user
          await user.purchasedCourses.push(course._id);
          await user.save();
        }
      }

      // Find the course by id
      const payment = await PaymentDetails.findOne({ email: customerEmail });

      // Prepare email template data
      const templateData = {
        fullname: payment.fullname,
        email: customerEmail,
      };

      await welcomeMail({
        fullname: templateData.fullname,
        email: templateData.email,
      });

      res.status(200).json({ message: "webhook!!!!", customerReference });
    }

    // Check for transfer successful
    if (payload.event == "transfer.success") {
      const { data } = payload;

      const customerReference = data.reference;
      const fieldsToUpdate = {
        status: "success",
      };

      //update payment status
      await PaymentDetails.findOneAndUpdate(
        { reference: customerReference },
        fieldsToUpdate,
        {
          new: true,
          runValidators: true,
        }
      );

      // Find the user by email
      const user = await User.findOne({ email: customerEmail });
      if (user) {
        // Find the course by id
        const payment = await PaymentDetails.findOne({ email: customerEmail });

        const course = await CourseModel.findById(payment.courseId);
        if (course) {
          // Associate the course with the user
          await user.purchasedCourses.push(course._id);
          await user.save();
        }
      }

      const payment = await PaymentDetails.findOne({ email: customerEmail });

      // Prepare email template data
      const templateData = {
        fullname: payment.fullname,
        email: customerEmail,
      };

      await welcomeMail({
        fullname: templateData.fullname,
        email: templateData.email,
      });

      res.status(200).json({ message: "webhook!!!!", customerReference });
    }

    // check if transfer failed
    if (payload.event == "transfer.failed") {
      const { data } = payload;
      const customerEmail = data.customer.email;

      const userDetails = await User.findOne({ customerEmail });

      await userDetails.remove();

      const customerReference = data.reference;
      const details = await PaymentDetails.findOne(customerReference);

      await details.remove();

      res
        .status(200)
        .json({ message: "Failed!!!!", customerEmail, customerReference });
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

module.exports = { verifyWebhookEvent, getCourseUsers, getCoursesPaymentStats };

// async function handleSuccessfulTransaction(data) {
//     const customerReference = data.reference;
//     const fieldsToUpdate = { status: "success" };

//     // Update payment status
//     await PaymentDetails.findOneAndUpdate({ reference: customerReference }, fieldsToUpdate, {
//         new: true,
//         runValidators: true,
//     });
// }

// async function handleFailedTransaction(data) {
//     const customerEmail = data.customer.email;
//     const customerReference = data.reference;

//     // Attempt to find and remove user details
//     const userDetails = await User.findOne({ email: customerEmail });
//     if (userDetails) {
//         await userDetails.remove();
//     }

//     // Attempt to find and remove payment details
//     const paymentDetails = await PaymentDetails.findOne({ reference: customerReference });
//     if (paymentDetails) {
//         await paymentDetails.remove();
//     }
// }
