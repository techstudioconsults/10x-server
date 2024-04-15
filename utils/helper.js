const verifyWebhookEvent = require('./verifyPayment');

const webhook = async (req, res) => {
  try {
    // Verify the webhook event
    const verifiedEvent = await verifyWebhookEvent(req, res);

    // console.log(verifiedEvent);
    if (verifiedEvent) {
      if (verifiedEvent.data && verifiedEvent.data.event === 'charge.success') {
        const metadata = verifiedEvent.data.data.authorization.metadata;
        const fullname = metadata.fullname;
        const courseId = metadata.courseId;
        const password = metadata.password;

        console.log('Fullname:', fullname);
        console.log('Course ID:', courseId);
        console.log('Password:', password);

        // ... Additional logic goes here ...

        res.status(200).send('Webhook event processed successfully');
      } else {
        // Handle other event types as needed
        res.status(200).send('Webhook event processed');
      }
    } else {
      // Invalid event, send an error response
      res.status(400).send('Invalid webhook event');
    }
  } catch (error) {
    console.error('Error processing webhook event:', error);
    res.status(500).send('An error occurred during webhook processing');
  }
};

module.exports = webhook;