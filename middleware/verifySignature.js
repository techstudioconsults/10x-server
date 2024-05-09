const crypto = require('crypto');

// Verify header signature from paystack
const verifySignature = (req, res, next) => {
    const hash = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
                       .update(JSON.stringify(req.body))
                       .digest('hex');

  if(hash !== req.headers['x-paystack-signature']){
    return res.status(400).json({ message: 'Invalid signature'});
  }
  next();
}

module.exports = verifySignature;