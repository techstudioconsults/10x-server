const User = require('../models/User'); 
const PaymentDetails = require('../models/Payment');
const asyncHandler = require('../middleware/async');

// verify transaction using webhook
const verifyWebhookEvent = async (req, res) => {
      try{
        const payload = req.body;
        if(payload.event == "charge.success"){
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
          res.status(200).json({message: "webhook!!!!", customerReference});
        }
        if(payload.event == "transfer.failed"){
          const { data } = payload;
          const customerEmail = data.customer.email
      
          const userDetails = await User.findOne({ customerEmail });

          await userDetails.remove();

          const customerReference = data.reference
          const details = await PaymentDetails.findOne(customerReference);

          await details.remove();

          res.status(200).json({message: "Failed!!!!!", customerEmail, customerReference});
          
         }
       
      }catch(error){
      res.status(500).json({message: error});
    }
    } 

    const getCourseUsersDetails = asyncHandler(async(req, res, next) => {
      const courseId = req.params.id;
      const userDetails = await PaymentDetails.find({courseId: courseId})

      res.status(200).json({ success: true, count: userDetails.length, data: userDetails});
  })

  const getUserById = asyncHandler(async(req, res, next) => {
    const payment = await PaymentDetails.findById(req.params.id).populate({
      path: 'User',
      select: 'fullname email '
    }); if(!payment){
      return next(new ErrorResponse(`No  with the id of ${req.params.id}`, 404))
    }
      
    
  res.status(200).json({ success: true, data: payment})
  })

        
module.exports = { verifyWebhookEvent, getCourseUsersDetails, getUserById } ;