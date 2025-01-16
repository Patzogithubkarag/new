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

    const response = await axios.get(`${baseUrl}/v5/position/list`, { params });

    if (response.status === 200 && response.data.retCode === 0) {
      const positions = response.data.result.list[0]; // Assuming list[0] contains relevant data
      return {
        symbol: positions.symbol,
        leverage: positions.leverage,
        size: positions.size,
        positionValue: positions.positionValue,
        avgPrice: positions.entryPrice,
        liqPrice: positions.liqPrice,
        positionIM: positions.positionIM,
        positionMM: positions.positionMM,
        markPrice: positions.markPrice,
        unrealisedPnl: positions.unrealisedPnl,
        curRealisedPnl: positions.cumRealisedPnl,
      };
    } else {
      console.error(`Error from Bybit API: ${response.data.retMsg}`);
      return null;
    }
  } catch (error) {
    console.error('Error connecting to Bybit API:', error.message);
    return null;
  }
}

// Serve the EJS template
app.get('/', (req, res) => {
  res.render('index'); // Render the EJS file
});

// Serve the Bybit data as JSON
app.get('/api/data', async (req, res) => {
  const data = await fetchBybitData();
  if (data) {
    res.json(data);
  } else {
    res.status(500).json({ error: 'Failed to fetch data from Bybit API' });
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
