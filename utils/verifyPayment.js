const crypto = require('crypto');
const User = require('../models/User'); 

const verifyWebhookEvent = async (req, res) => {
  const hash = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY).update(JSON.stringify(req.body)).digest('hex');
      
  if (hash === req.headers['x-paystack-signature']) {
        const event = req.body;
        if(event.event == "charge.success"){
          const { data } = event;
          const customerEmail = data.customer.email
          res.status(200).json({message: "webhook!!!!", customerEmail});
        }
        if(event.event == "transfer.failed"){
          const { data } = event;
          const customerEmail = data.customer.email
          res.status(200).json({message: "Failed!!!!", customerEmail});
       
          const userDetails = User.findOne({ customerEmail });

          await userDetails.remove();
        }
          
         }
       
        }

        
module.exports = verifyWebhookEvent ;