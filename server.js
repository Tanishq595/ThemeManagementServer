const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection with optimized settings for serverless
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://tanishqagarwal595:tanishq595@cluster0.skrcz2y.mongodb.net/myDatabase?retryWrites=true&w=majority&appName=Cluster0', {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

// Initialize connection
connectDB();

const DataSchema = new mongoose.Schema({}, { strict: false });
const DataModel = mongoose.model('Data', DataSchema);

// API Routes with proper error handling
app.get('/api/data', async (req, res) => {
  try {
    const data = await DataModel.find();
    res.json(data);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/data', async (req, res) => {
  try {
    const newData = new DataModel(req.body);
    await newData.save();
    res.json(newData);
  } catch (err) {
    console.error('Error saving data:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/data/:name', async (req, res) => {
  try {
    await DataModel.deleteOne({ name: req.params.name });
    res.json({ success: true });
  } catch (err) {
    console.error('Error deleting data:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Vercel-specific export (required)
module.exports = app;
