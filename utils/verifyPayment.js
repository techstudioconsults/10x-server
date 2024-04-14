const crypto = require('crypto');

const verifyWebhookEvent = (event) => {
  const paystack_secret_key = process.env.PAYSTACK_SECRET_KEY;
  const hash = crypto.createHmac('sha512', paystack_secret_key).update(JSON.stringify(event)).digest('hex');

  if (hash === event.data.sig) {
    return event;
  } else {
    throw new Error('Invalid webhook event signature');
  }
};

module.exports = verifyWebhookEvent ;