const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const app = express();

// Bybit API Configuration
const apiKey = '7qrDVFxskTxzsUYf10';
const apiSecret = 'jXTdtshSImrbGNEtaCpXZDoOxuBItGGSOpwN';
const baseUrl = 'https://api.bybit.com'; // Replace with the actual base URL

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public')); // Serve static files like CSS and JS

function getUTCimestamp() {
  return Date.now();
}

function generateSignature(params, apiSecret) {
  const queryString = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join('&');

  return crypto.createHmac('sha256', apiSecret).update(queryString).digest('hex');
}

async function fetchBybitData() {
  try {
    const timestamp = getUTCimestamp();
    const params = {
      api_key: apiKey,
      timestamp: timestamp,
      accountType: 'UNIFIED',
      category: 'linear',
      symbol: 'VRAUSDT',
    };

    params.sign = generateSignature(params, apiSecret);

   try {
    const response = await axios.get(`${baseUrl}/v5/position/list`, { params });

    if (response.status === 200 && response.data.retCode === 0) {
      const data = response.data.result.list[0]; // Get the first item from the list
      console.log(JSON.stringify(data, null, 2));
      const value = data.positionValue
      return {
        symbol: data.symbol,
        leverage: data.leverage,
        size: data.size,
        positionValue: parseFloat(data.positionValue).toFixed(2),
        avgPrice: parseFloat(data.avgPrice).toFixed(6),
        liqPrice: parseFloat(data.liqPrice).toFixed(6),
        positionIM: parseFloat(data.positionIM).toFixed(4),
        positionMM: parseFloat(data.positionMM).toFixed(4),
        markPrice: parseFloat(data.markPrice).toFixed(6),
        unrealisedPnl: parseFloat(data.unrealisedPnl).toFixed(4),
        curRealisedPnl: parseFloat(data.curRealisedPnl).toFixed(4),
      };
    } else {
      throw new Error(`Error: ${response.data.retMsg}`);
    }
  } catch (error) {
    console.error('Error fetching data from Bybit:', error);
    throw error;
  }
}

// API route to return the data
app.get('/api/data', async (req, res) => {
  try {
    const data = await fetchData();
    res.json(data); // Return the data as JSON
  } catch (error) {
    res.status(500).send('Error fetching data');
  }
});

// Main route to render the page
app.get("/", (req, res) => {
  res.render('index');
});

app.post('/submit', (req, res) => {
    
    console.log(inputValue)
});



app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

