const express = require('express');
const axios = require('axios');
const app = express();

// Bybit API Configuration
const apiKey = '7qrDVFxskTxzsUYf10';
const apiSecret = 'jXTdtshSImrbGNEtaCpXZDoOxuBItGGSOpwN';
const baseUrl = 'https://api.bytick.com/'; // Replace with the actual base URL

// Serve the EJS template
app.set('view engine', 'ejs');
app.set('views', './views');

// Define a simple function to check the Bybit API
async function checkBybitAPI() {
  try {
    const params = {
      api_key: apiKey,
      timestamp: Date.now(),
      accountType: 'UNIFIED',
    };

    const response = await axios.get(`${baseUrl}/v5/position/list`, { params });
    if (response.status === 200 && response.data.retCode === 0) {
      return { message: 'Bybit API connection successful', success: true };
    } else {
      return { message: 'Bybit API connection failed', success: false };
    }
  } catch (error) {
    console.error('Error connecting to Bybit API:', error.message);
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
