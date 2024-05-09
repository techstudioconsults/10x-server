const User = require('../models/User'); 
const PaymentDetails = require('../models/Payment');
const asyncHandler = require('../middleware/async');
const sendEmail = require('../utils/sendEmail');

//verify transaction using webhook
const verifyWebhookEvent = async (req, res) => {
      try{
        const payload = req.body;

        // check for transaction success
        if(payload.event == "charge.success"){
          const { data } = payload;
          const customerEmail = data.customer.email

          const customerReference = data.reference
          const fieldsToUpdate = {
            status:"success"
          }   

        //update payment status
       await PaymentDetails.findOneAndUpdate({ reference:customerReference}, fieldsToUpdate, {
          new: true,
          runValidators: true,
        });

        const message = "Welcome to 10x Revenue we hope to see more of you"

           sendEmail({
             email: customerEmail,
             subject: "Welcome to 10x",
             message,
           });

          res.status(200).json({message: "webhook!!!!", customerReference});
        }

        // Check for transfer successful
        if(payload.event == "transfer.success"){
           const { data } = payload;

          const customerReference = data.reference
          const fieldsToUpdate = {
            status:"success"
          } 

        //update payment status
       await PaymentDetails.findOneAndUpdate({ reference:customerReference}, fieldsToUpdate, {
          new: true,
          runValidators: true,
        })

        const message = "Hello!!!";

           sendEmail({
             email: customerEmail,
             subject: "Welcome to 10x Revenue we hope to see more of you",
             message,
           });

          res.status(200).json({message: "webhook!!!!", customerReference});

         }

         // check if transfer failed
         if(payload.event == "transfer.failed"){
          const { data } = payload;
          const customerEmail = data.customer.email
      
          const userDetails = await User.findOne({ customerEmail });

          await userDetails.remove();

          const customerReference = data.reference
          const details = await PaymentDetails.findOne(customerReference);

          await details.remove();

          res.status(200).json({message: "Failed!!!!", customerEmail, customerReference});
         }
       
      }catch(error){
      res.status(500).json({message: error});
    }
  } 

  

  // Get payment Details of users per course
  const getCourseUsersDetails = asyncHandler(async (req, res, next) => {
    const courseId = req.params.id;

    // Validate courseId
    if (!courseId) {
        return res.status(400).json({ success: false, message: "Invalid course ID" });
    }

    try {
        //populate user details
        const userDetails = await PaymentDetails.find({ courseId: courseId, status: 'success' }).populate('user').exec();
        const totalAmount = await PaymentDetails.getTotalAmount(courseId);

        // Check if data exists
        if (userDetails.length === 0) {
            return res.status(404).json({ success: false, message: "No payment details found for this course" });
        }

        res.status(200).json({ success: true, count: userDetails.length, data: userDetails, totalAmount: totalAmount });
    } catch (error) {
        next(error);
    }
});


  const getUserById = asyncHandler(async(req, res, next) => {
    const payment = await PaymentDetails.findById(req.params.id).populate({
      path: 'User',
      select: 'fullname email '
    }); if(!payment){
      return next(new ErrorResponse(`No  with the id of ${req.params.id}`, 404))
    }
      
    
  res.status(200).json({ success: true, data: payment})
  })



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



        
module.exports = { verifyWebhookEvent, getCourseUsersDetails, getUserById} ;