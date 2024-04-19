const crypto = require('crypto');
const User = require('../models/User'); 
const PaymentDetails = require('../models/Payment');

const verifyWebhookEvent = async (req, res) => {
  const hash = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY).update(JSON.stringify(req.body)).digest('hex');
      try{
  if (hash === req.headers['x-paystack-signature']) {
        const event = req.body;
        if(event.event == "charge.success"){
          const { data } = event;

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
        if(event.event == "transfer.failed"){
          const { data } = event;
          const customerEmail = data.customer.email
      
          const userDetails = await User.findOne({ customerEmail });

          await userDetails.remove();

          const customerReference = data.reference
          const details = await PaymentDetails.findOne(customerReference);

          await details.remove();

          res.status(200).json({message: "Failed!!!!", customerEmail, customerReference});

        }
          
         }
       
      }catch(error){
      res.status(500).json({message: error});
    }
    } 

        
module.exports = verifyWebhookEvent ;