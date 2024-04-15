const verifyWebhookEvent = require('./verifyPayment');

const webhook = async (req, res) => {
  try {
    // Verify the webhook event
    const verifiedEvent = await verifyWebhookEvent(req, res);

    console.log('Verified Event:', verifiedEvent);

    if (verifiedEvent) {
        if (verifiedEvent.data && verifiedEvent.data.event === 'charge.success') {
          const metadata = verifiedEvent.data.authorization.metadata;
        
          if (typeof metadata === 'object' && metadata !== null) {
            const fullname = metadata.fullname;
            const courseId = metadata.courseId;
            const password = metadata.password;
        
            console.log('Fullname:', fullname);
            console.log('Course ID:', courseId);
            console.log('Password:', password);
        
            // ... Additional logic goes here ...
        
            res.status(200).send('Webhook event processed successfully');
          } else {
            console.log('Metadata structure is not as expected');
            res.status(400).send('Invalid metadata structure');
          }
        }
       
      } else {
        // Handle other event types as needed
        res.status(200).send('Webhook event processed');
      }
  } catch (error) {
    console.error('Error processing webhook event:', error);
    res.status(500).send('An error occurred during webhook processing');
  }
};

module.exports = webhook;