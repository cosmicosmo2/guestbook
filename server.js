const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

// Define what a guestbook entry looks like
const Entry = mongoose.model('Entry', {
  name: String,
  message: String,
  date: { type: Date, default: Date.now }
});

// Route to get all entries
app.get('/api/entries', async (req, res) => {
  const entries = await Entry.find().sort({ date: -1 });
  res.json(entries);
});

// Route to add new entry
app.post('/api/entries', async (req, res) => {
  const entry = new Entry({
    name: req.body.name,
    message: req.body.message
  });
  await entry.save();
  res.json(entry);
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});