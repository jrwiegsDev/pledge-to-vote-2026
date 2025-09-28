require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 5002; // Using a different port

app.use(cors());
app.use(express.json());

// --- MongoDB Connection ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Atlas connected successfully.'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- Mongoose Schema (The structure for a single pledge) ---
const pledgeSchema = new mongoose.Schema({
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Pledge = mongoose.model('Pledge', pledgeSchema);

// --- API Endpoints ---

// POST /api/pledges: Receives a new pledge and saves it to the database
app.post('/api/pledges', async (req, res) => {
  try {
    const { state, zipCode } = req.body;
    const newPledge = new Pledge({ state, zipCode });
    await newPledge.save();
    
    // After saving, get the new total count of all pledges
    const totalPledges = await Pledge.countDocuments();
    res.status(201).json({ message: 'Pledge saved!', totalPledges });
  } catch (err) {
    res.status(500).json({ message: 'Error saving pledge' });
  }
});

// GET /api/pledges/count: Gets the current total number of pledges
app.get('/api/pledges/count', async (req, res) => {
    try {
        const totalPledges = await Pledge.countDocuments();
        res.json({ totalPledges });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching pledge count' });
    }
});

// GET /api/pledges/by-state: Gets the pledge counts grouped by state
app.get('/api/pledges/by-state', async (req, res) => {
    try {
        // This is a MongoDB aggregation pipeline. It groups all pledges by state and sums them up.
        const pledgesByState = await Pledge.aggregate([
            { $group: { _id: "$state", count: { $sum: 1 } } },
            { $project: { state: "$_id", count: 1, _id: 0 } }
        ]);
        res.json(pledgesByState);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching state data' });
    }
});


// --- Start the Server ---
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});