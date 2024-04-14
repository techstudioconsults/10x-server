const crypto = require('crypto');


const verifyPayment = function(req, res) {
    const hash = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY).update(JSON.stringify(req.body)).digest('hex');
   
     if (hash == req.headers['x-paystack-signature']) {
       // Retrieve the request's body
       const event = req.body;
       console.log(event);
    
     } 
     
   };
   

module.exports = verifyPayment;