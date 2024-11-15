const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const entrySchema = new mongoose.Schema({
  name: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const Entry = mongoose.model('Entry', entrySchema);

// Your existing routes stay the same
app.post('/api/entries', async (req, res) => {
  try {
    const { name, message } = req.body;
    const entry = new Entry({ name, message });
    await entry.save();
    res.status(201).json(entry);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/entries', async (req, res) => {
  try {
    const entries = await Entry.find()
      .sort({ timestamp: -1 })
      .limit(50);
    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add this new delete route
app.delete('/api/entries/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { adminkey } = req.headers;
    
    if (adminkey !== process.env.ADMIN_KEY) {
      return res.status(401).json({ error: 'Wrong admin key!' });
    }

    await Entry.findByIdAndDelete(id);
    res.json({ message: 'Entry deleted successfully!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});