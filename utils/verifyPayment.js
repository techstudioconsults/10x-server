const crypto = require('crypto');

const verifyWebhookEvent = async (req, res) => {
  const hash = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY).update(JSON.stringify(req.body)).digest('hex');

  if (hash === req.headers['x-paystack-signature']) {
    const event = req.body;

    if(event && event.event === 'transfer.success'){

      console.log(event);

      return res.status(200).json({ message: 'Transfer successful' });
    }

    return event;
  } 

  // Acknowledge the webhook event to prevent retries
  res.status(200).send('Webhook event received');
};

module.exports = verifyWebhookEvent ;