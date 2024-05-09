// require('dotenv').config();
const https = require('https');
const crypto = require('crypto');

const verifyPaymentRef = async (req, res, ref) => {
  try {
    ref = req.params.ref; // Assuming reference is a URL parameter

        const verifyOptions = {
            hostname: 'api.paystack.co',
            port: 443,
            path: `/transaction/verify/:${ref}`, 
            method: 'GET',
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
            }
        };

    const clientReq = https
      .request(verifyOptions, (apiRes) => {
        let data = "";
        apiRes.on("data", (chunk) => {
          data += chunk;
        });
        apiRes.on("end", () => {
          console.log(JSON.parse(data));
          res.status(200).json(JSON.parse(data)); // Send parsed JSON data as response
        });
      })
      .on("error", (error) => {
        console.error(error);
        res.status(500).json({ error: "An error occurred" });
      });

    clientReq.end(); // No need to write any data for a GET request
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
};



module.exports = {initializePayment,  verifyPaymentRef};
