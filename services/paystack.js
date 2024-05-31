/**
 *  @author @obajide028 Odesanya Babajide
 *  @version 1.0
 */

const axios = require("axios");
const crypto = require("crypto");
const ErrorResponse = require("../utils/errorResponse");

const initializePayment = async (req) => {
  try {
    const { email, amount } = req.body;
    if (!email || !amount) {
      throw new ErrorResponse("Email and amount are required", 401);
    }
    const requestData = {
      email,
      amount: amount * 100,
    };
    const options = {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    };
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      requestData,
      options
    );
    return response.data;
  } catch (error) {
    console.error(error.message);
  }
};

const verifyPaymentRef = async (req, res) => {
  const ref = req.params.ref;
  if (!ref) {
    return res.status(400).json({ message: "No reference provided" });
  }

  try {
    // Build the API URL with the reference code
    const apiUrl = `https://api.paystack.co/transaction/verify/${ref}`;

    // Make the GET request using axios
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });

    // Output the data to the console (for debugging purposes)
    console.log(response.data);

    // Send the response data as JSON to the client
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error making HTTP request:", error);
    // Handle errors from axios or internal processing
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error(error.response.data);
      console.error(error.response.status);
      console.error(error.response.headers);
      res.status(error.response.status).json(error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error(error.request);
      res.status(500).json({ error: "No response received" });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error", error.message);
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = { initializePayment, verifyPaymentRef };
