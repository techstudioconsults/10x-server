const verifyWebhookEvent = require('./verifyPayment');

const webhook = async (req, res) => {
    const event = req.body;
  
    try {
      // Verify the webhook event
      const verifiedEvent = await verifyWebhookEvent(event);
  
      if (verifiedEvent.data.status === 'success') {
        // Handle successful payment event
        // ...
  
        res.status(200).send('Webhook event processed successfully');
      } else {
        res.status(200).send('Webhook event processed');
      }
    } catch (error) {
      console.error('Error processing webhook event:', error);
      res.status(500).send('An error occurred during webhook processing');
    }
  };


  module.exports = webhook;