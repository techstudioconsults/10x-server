const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");
const asyncHandler = require("../middleware/async");
const sendEmail = require("../utils/sendEmail");
const sendTokenResponse = require("../utils/sendToken");
const { initializePayment } = require("../services/paystack");
const uploadImage = require("../utils/uploadImage");
const Payment = require("../models/Payment");
const crypto = require("crypto");

//@desc     Register user
//@route    POST /api/v1/auth/register
//@access   Public
const register = asyncHandler(async (req, res, next) => {
  const { email, password, fullname, amount, courseId } = req.body;

  try {
    // create user
    const user = await User.create({ fullname, email, password });

    //Initiate payment with paystack
    const paymentData = await initializePayment(req);

    // Create a new payment record with pending status
    const payment = await Payment.create({
      user: user._id,
      amount,
      courseId,
      fullname,
      email,
      reference: paymentData.data.reference,
      status: "pending",
    });

    //save the payment record
    await payment.save();

    // Send token response along with the payment data
    sendTokenResponse(user, 200, res, paymentData);
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "An error occurred during registration" });
  }
});

//@desc     Login user
//@route    POST /api/v1/auth/login
//@access   Public
const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // validate email & password
  if (!email || !password) {
   return res.status(404).json({success: false, message:"Invalid Credentials"});
  }

  // Check for user
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return res.status(401).json({success: false, message:"Invalid email"});
  }

  // check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
   return res.status(404).json({success: false, message:"Invalid Password"});
  }

  sendTokenResponse(user, 200, res);
});

//@desc     Logout user out / clear cookie
//@route    GET /api/v1/auth/logout
//@access   Private
const logout = asyncHandler(async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({ success: true, data: {} });
});

//@desc     Get current logged in user
//@route    GET /api/v1/auth/me
//@access   Private
const getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new ErrorResponse("User not found", 404));
  }
  res.status(200).json({ success: true, data: user });
});

//@desc     Update user details
//@route    PUT /api/v1/auth/updatedetails
//@access   Private
const updateDetails = asyncHandler(async (req, res, next) => {
  // upload image
  const photoUrl = await uploadImage(req.files.photo.tempFilePath);
  req.body.photo = photoUrl;
  const fieldsToUpdate = {
    fullname: req.body.fullname,
    email: req.body.email,
    photo: req.body.photo,
  };

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: user });
});

//@desc     update password
//@route   PUT /api/v1/auth/updatepassword
//@access  Private
const updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  // Check current password
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse("Password is incorrect", 401));
  }
  user.password = req.body.newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});

//@desc     Forgot password
//@route    POST /api/v1/auth/forgotpassword
//@access   Private
const forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse("There is no user with that email", 404));
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  console.log(resetToken);

  // Create reset url
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/resetpassword/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested
      the reset of a password. Please make a request to: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password reset token",
      message,
    });
    res.status(200).json({ success: true, data: "Email sent" });
  } catch (error) {
    console.log(error);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse("Email could not be sent", 500));
  }
});

//@desc     Reset password
//@route    POST /api/v1/auth/resetpassword/:resettoken
//@access   Private
const resetPassword = asyncHandler(async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resettoken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse("Invalid token", 400));
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);
});

module.exports = {
  register,
  login,
  getMe,
  updateDetails,
  updatePassword,
  forgotPassword,
  resetPassword,
  logout,
};
