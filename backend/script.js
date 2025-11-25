require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5002;
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

// Validate that API key is present
if (!GOOGLE_PLACES_API_KEY) {
  console.error('ERROR: GOOGLE_PLACES_API_KEY is not set in .env file');
  process.exit(1);
}

// Middleware
// Configure CORS for production and development
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());

// Import routes
const candidatesRouter = require('./routes/candidates');
const electionsRouter = require('./routes/elections');
const authRouter = require('./routes/auth');

// Initialize database
require('./db/database');

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/candidates', candidatesRouter);
app.use('/api/elections', electionsRouter);

app.get('/', (req, res) => {
  res.send('Backend server is running. Use the /autocomplete endpoint for address suggestions.');
});

// Autocomplete route
app.get('/autocomplete', async (req, res) => {
  const { input } = req.query;

  if (!input || input.length < 3) {
    return res.status(400).send({ error: 'Input must be at least 3 characters long' });
  }

  const apiUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${GOOGLE_PLACES_API_KEY}`;

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

