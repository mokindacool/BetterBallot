// script.js

const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 5002; // You can adjust the port if necessary
const apiKey = 'AIzaSyAJkTs0t-NeKUJlCRPDyMpLoTmflXIclE8'; // Replace with your actual Google Maps API key

// Enable CORS for all routes
app.use(cors());

// Base route
app.get('/', (req, res) => {
  res.send('Backend server is running. Use the /autocomplete endpoint for address suggestions.');
});

// Autocomplete route
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

// Start the backend server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


// const express = require('express');
// const app = express();
// const port = 5002;

// const cors = require('cors');
// app.use(cors());

// const electionData = {
//   // Example data structure for districts and elections
//   "94702": { district: "District 1", election: "City Council District 1 Election" },
//   "94703": { district: "District 2", election: "City Council District 2 Election" },
//   // Add other zip codes and their respective districts/elections here...
// };

// app.get('/autocomplete', (req, res) => {
//   const input = req.query.input;
//   const suggestions = Object.keys(electionData).filter(zip => zip.startsWith(input)).map(zip => ({
//     description: `Zip Code ${zip}`,
//   }));
//   res.json({ predictions: suggestions });
// });

// app.listen(port, () => {
//   console.log(`Server running on http://localhost:${port}`);
// });


// app.get('/autocomplete', async (req, res) => {
//   const { input } = req.query;

//   if (!input || input.length < 3) {
//     return res.status(400).send({ error: 'Input must be at least 3 characters long' });
//   }

//   const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}`;

//   try {
//     const response = await axios.get(apiUrl);
//     res.send(response.data);
//   } catch (error) {
//     console.error('Error fetching autocomplete suggestions:', error.message);
//     res.status(500).send({ error: 'Failed to fetch autocomplete suggestions' });
//   }
// });

// app.listen(port, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

