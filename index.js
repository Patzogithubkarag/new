const express = require('express');
const axios = require('axios');

const app = express();

// MEXC API endpoint for the VRA/USDT spot market
const apiUrl = 'https://api.mexc.com/api/v3/ticker/24hr?symbol=VRAUSDT';
app.set('view engine', 'ejs');
app.set('views', './views');

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
    // Render the EJS file and pass the data
    res.render('index', { priceData });
  } else {
    res.render('error', { message: 'Error fetching data from MEXC' });
  }
});

// Start the server on port 3000
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
