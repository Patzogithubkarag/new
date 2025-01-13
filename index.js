const express = require('express');
const axios = require('axios');
const crypto = require('crypto'); // Required for generating the signature
const app = express();

// Bybit API Configuration
const apiKey = '7qrDVFxskTxzsUYf10';
const apiSecret = 'jXTdtshSImrbGNEtaCpXZDoOxuBItGGSOpwN';
const baseUrl = 'https://api.bybit.com'; // Correct base URL for v5

// Serve the EJS template
app.set('view engine', 'ejs');
app.set('views', './views');

// Function to get the current UTC timestamp in milliseconds
function getUTCimestamp() {
  return Date.now(); // Returns current timestamp in milliseconds
}

// Function to generate the API signature
function generateSignature(params, apiSecret) {
  const queryString = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join('&');

  return crypto.createHmac('sha256', apiSecret).update(queryString).digest('hex');
}

// Define a function to check the Bybit Spot API
async function checkBybitSpotAPI() {
  try {
    const timestamp = getUTCimestamp(); // Get the current UTC timestamp in milliseconds
    console.log("Using UTC timestamp:", timestamp);

    // Use accountType as 'SPOT' for spot trading data
    const params = {
      api_key: apiKey,
      timestamp: timestamp,
      accountType: 'SPOT', // Set accountType to SPOT for spot trade data
      recv_window: 5000, // Optional: to allow a 5-second window for request validation
    };

    // Add the signature to the request
    params.sign = generateSignature(params, apiSecret);
    console.log("Generated signature:", params.sign);

    // Make the API request to the Spot Orders endpoint (v5 spot order list)
    const response = await axios.get(`${baseUrl}/v5/spot/order/list`, { params });
    console.log("Bybit Spot API response:", response.data);

    if (response.status === 200 && response.data.retCode === 0) {
      return { message: 'Bybit Spot API connection successful', success: true };
    } else {
      return { 
        message: `Bybit Spot API connection failed: ${response.data.retMsg}`, 
        success: false 
      };
    }
  } catch (error) {
    console.error('Error connecting to Bybit Spot API:', error.message);

    // Log the full error details for debugging
    if (error.response) {
      console.error('Error details:', error.response.data);
    } else {
      console.error('Error details:', error);
    }

    return { message: 'Error connecting to Bybit Spot API', success: false };
  }
}

// Main route to test the Spot API and return JSON
app.get('/', async (req, res) => {
  const apiStatus = await checkBybitSpotAPI();
  res.json(apiStatus); // Return the status as JSON
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
