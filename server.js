// server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// This lets us receive JSON data
app.use(express.json());
// This lets your website talk to this server
app.use(cors());

// Create a template for what a guestbook entry looks like
const entrySchema = new mongoose.Schema({
  name: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

// Create a way to store entries using our template
const Entry = mongoose.model('Entry', entrySchema);

// Add this code to server.js, before the app.listen line

// Route to save a new entry
app.post('/api/entries', async (req, res) => {
  try {
    // Get the name and message from the form
    const { name, message } = req.body;
    
    // Create a new entry
    const entry = new Entry({
      name: name,
      message: message
    });
    
    // Save it to MongoDB
    await entry.save();
    
    // Send back a success message
    res.status(201).json(entry);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route to get all entries
app.get('/api/entries', async (req, res) => {
  try {
    // Get the latest 50 entries, newest first
    const entries = await Entry.find()
      .sort({ timestamp: -1 })
      .limit(50);
    
    // Send them back
    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});