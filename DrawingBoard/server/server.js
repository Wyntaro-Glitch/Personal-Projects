const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage
let savedStrokes = [];

// API Endpoints
app.get('/strokes', (req, res) => {
  res.json(savedStrokes);
});

app.post('/strokes', (req, res) => {
  savedStrokes = req.body;
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
});