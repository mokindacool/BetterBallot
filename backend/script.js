const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Import CORS

const app = express();
const PORT = 5001;

const apiKey = 'AIzaSyAJkTs0t-NeKUJlCRPDyMpLoTmflXIclE8'; // Replace 'YOUR_GOOGLE_MAPS_API_KEY' with your actual key
app.use(cors()); // Enable CORS for all routes

app.get('/', (req, res) => {
  res.send('Backend server is running. Use the /autocomplete endpoint for address suggestions.');
});

app.get('/autocomplete', async (req, res) => {
  const { input } = req.query;

  if (!input || input.length < 3) {
    return res.status(400).send({ error: 'Input must be at least 3 characters long' });
  }

  const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}`;

  try {
    const response = await axios.get(apiUrl);
    res.send(response.data);
  } catch (error) {
    console.error('Error fetching autocomplete suggestions:', error.message);
    res.status(500).send({ error: 'Failed to fetch autocomplete suggestions' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});