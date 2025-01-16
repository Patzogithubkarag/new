const express = require('express');
const axios = require('axios');
const crypto = require('crypto'); // Required for generating the signature
const app = express();

// Bybit API Configuration
const apiKey = '7qrDVFxskTxzsUYf10';
const apiSecret = 'jXTdtshSImrbGNEtaCpXZDoOxuBItGGSOpwN';
const baseUrl = 'https://api.bybit.com'; // Replace with the actual base URL

// Serve the EJS template
app.set('view engine', 'ejs');
app.set('views', './views');

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

// Define a function to check the Bybit API
async function checkBybitAPI() {
  try {
    const timestamp = getUTCimestamp(); // Convert to seconds
    const params = {
      api_key: apiKey,
      timestamp: timestamp,
      accountType: 'UNIFIED',
         category: 'linear',
    symbol: 'VRAUSDT',
    };

    // Add the signature to the request
    params.sign = generateSignature(params, apiSecret);

    // Make the API request
    const response = await axios.get(`${baseUrl}/v5/position/list`, { params });

    if (response.status === 200 && response.data.retCode === 0) {
      return { message: 'Bybit API connection successful', success: true };
    } else {
      return { 
        message: `Bybit API connection failed: ${response.data.retMsg}`, 
        success: false 
      };
    }
  } catch (error) {
    console.error('Error connecting to Bybit API:', error.message);

    // Log the full error details for debugging
    if (error.response) {
      console.error('Error details:', error.response.data);
    } else {
      console.error('Error details:', error);
    }

    return { message: 'Error connecting to Bybit API', success: false };
  }
}

// Main route to test the API and return JSON
app.get('/', async (req, res) => {
  const apiStatus = await checkBybitAPI();
  res.json(apiStatus); // Return the status as JSON
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
