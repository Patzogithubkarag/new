const express = require('express');
const axios = require('axios');

const app = express();

// MEXC API endpoint for the VRA/USDT spot market
const apiUrl = 'https://api.mexc.com/api/v3/ticker/24hr?symbol=VRAUSDT';

// Function to fetch spot price
async function getVraSpotPrice() {
  try {
    const response = await axios.get(apiUrl);
    return {
      price: response.data.lastPrice,
      volume: response.data.volume,
      high: response.data.highPrice,
      low: response.data.lowPrice
    };
  } catch (error) {
    console.error('Error fetching VRA/USDT data:', error);
    return null;
  }
}

// Serve the VRA spot price on a webpage
app.get('/', async (req, res) => {
  const priceData = await getVraSpotPrice();
  
  if (priceData) {
    // Display the data in HTML format
    res.send(`
      <html>
        <head><title>VRA/USDT Spot Price</title></head>
        <body>
          <h1>VRA/USDT Spot Price Information</h1>
          <p><strong>Current Price:</strong> ${priceData.price}</p>
          <p><strong>24h Volume:</strong> ${priceData.volume}</p>
          <p><strong>24h High:</strong> ${priceData.high}</p>
          <p><strong>24h Low:</strong> ${priceData.low}</p>
        </body>
      </html>
    `);
  } else {
    res.send('<h1>Error fetching data from MEXC</h1>');
  }
});

// Start the server on port 3000
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
