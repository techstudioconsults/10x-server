const verifyWebhookEvent = require('./verifyEvent');

const webhook = async function(req, res) {
    try {
        // Verify the Paystack signature
        const verifiedEvent = verifyWebhvookEvent(req);

        if (verifiedEvent.data.status === 'success') {
            // Payment transaction was successful
            // Proceed with further processing or handling of the webhook event
            console.log('Payment transaction was successful:', verifiedEvent.data);

            // Your code to handle successful payment transaction
            // ...
        } else {
            // Payment transaction was not successful
            console.log('Payment transaction was not successful:', verifiedEvent.data);
        }

        // Respond to Paystack with a success message
        res.status(200).send('Webhook event processed successfully');
    } catch (error) {
        console.error('Error processing webhook event:', error);
        res.status(500).send('An error occurred during webhook processing');
    }
};

module.exports = webhook;
