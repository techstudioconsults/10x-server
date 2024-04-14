require('dotenv').config();
const https = require('https');
const crypto = require('crypto');


const initializePayment = (req, res) => {
    try {
      const { email, amount } = req.body;
  
      if (!email || !amount) {
        return res.status(400).json({ error: 'Email and amount are required' });
      }
  
      const params = JSON.stringify({ email, amount: amount * 100 });
      const options = {
        hostname: 'api.paystack.co',
        port: 443,
        path: '/transaction/initialize',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
          'Content-Length': params.length,
        },
      };
  
      const clientReq = https.request(options, (apiRes) => {
        let data = '';
  
        apiRes.on('data', (chunk) => {
          data += chunk;
        });
  
        apiRes.on('end', () => {
          const responseData = JSON.parse(data);
  
          if (apiRes.statusCode === 200) {
            res.status(200).json({ authorization_url: responseData.data.authorization_url });
          } else {
            res.status(apiRes.statusCode).json({ error: `An error occurred while contacting payment gateway: ${responseData.message}` });
          }
        });
      });
  
      clientReq.on('error', (error) => {
        console.error('Paystack API request error:', error);
        res.status(500).json({ error: 'An error occurred while contacting payment gateway' });
      });
  
      clientReq.write(params);
      clientReq.end();
    } catch (error) {
      console.error('Initialization error:', error);
      res.status(500).json({ error: 'An error occurred during payment initialization' });
    }
  };


const verifyPayment = async (req, res, ref) => {
    try {
         ref = req.params; // Assuming reference is a URL parameter

        const verifyOptions = {
            hostname: 'api.paystack.co',
            port: 443,
            path: `/transaction/verify/${ref}`, 
            method: 'GET',
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
            }
        };

        const clientReq = https.request(verifyOptions, apiRes => {
            let data = '';
            apiRes.on('data', (chunk) => {
                data += chunk;
                
            });
            apiRes.on('end', () => {
                console.log(JSON.parse(data));
                res.status(200).json(JSON.parse(data)); // Send parsed JSON data as response
            });
        }).on('error', error => {
            console.error(error);
            res.status(500).json({ error: 'An error occurred' });
        });

        clientReq.end(); // No need to write any data for a GET request
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
};


// const webhook = function(req, res) {
//  const hash = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY).update(JSON.stringify(req.body)).digest('hex');

//   if (hash == req.headers['x-paystack-signature']) {
//     // Retrieve the request's body
//     const event = req.body;
//     console.log(event);


//   } 
  
// };




module.exports = {initializePayment,  verifyPayment};