require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// --- NEW DEPS ---
const sharp = require('sharp');
const path = require('path');

const app = express();
const port = 5002;

app.use(cors());
app.use(express.json());

// --- MongoDB Connection ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Atlas connected successfully.'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- Mongoose Schema ---
const pledgeSchema = new mongoose.Schema({
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Pledge = mongoose.model('Pledge', pledgeSchema);

// --- State Name Helper ---
const stateNames = {
    AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas', CA: 'California',
    CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware', FL: 'Florida', GA: 'Georgia',
    HI: 'Hawaii', ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa',
    KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine', MD: 'Maryland',
    MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota', MS: 'Mississippi',
    MO: 'Missouri', MT: 'Montana', NE: 'Nebraska', NV: 'Nevada', NH: 'New Hampshire',
    NJ: 'New Jersey', NM: 'New Mexico', NY: 'New York', NC: 'North Carolina',
    ND: 'North Dakota', OH: 'Ohio', OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania',
    RI: 'Rhode Island', SC: 'South Carolina', SD: 'South Dakota', TN: 'Tennessee',
    TX: 'Texas', UT: 'Utah', VT: 'Vermont', VA: 'Virginia', WA: 'Washington',
    WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming'
};


// --- API Endpoints ---

// POST /api/pledges
app.post('/api/pledges', async (req, res) => {
  try {
    const { state, zipCode } = req.body;
    const newPledge = new Pledge({ state, zipCode });
    await newPledge.save();
    
    const totalPledges = await Pledge.countDocuments();
    res.status(201).json({ message: 'Pledge saved!', totalPledges });
  } catch (err) {
    res.status(500).json({ message: 'Error saving pledge' });
  }
});

// GET /api/pledges/count
app.get('/api/pledges/count', async (req, res) => {
    try {
        const totalPledges = await Pledge.countDocuments();
        res.json({ totalPledges });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching pledge count' });
    }
});

// GET /api/pledges/by-state
app.get('/api/pledges/by-state', async (req, res) => {
    try {
        const pledgesByState = await Pledge.aggregate([
            { $group: { _id: "$state", count: { $sum: 1 } } },
            { $project: { state: "$_id", count: 1, _id: 0 } }
        ]);
        // Fixed a small typo here
        res.json(pledgesByState);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching state data' });
    }
});

// --- CORRECTED IMAGE GENERATION ENDPOINT ---
app.get('/api/share/image/:stateAbbr.png', async (req, res) => {
    try {
        const { stateAbbr } = req.params;
        const stateName = stateNames[stateAbbr.toUpperCase()] || 'this election';

        // Path is correct now, looking in the same directory as server.js
        const templatePath = path.join(__dirname, 'share-template.png');
        const fontPath = path.join(__dirname, 'Inter-VariableFont_opsz,wght.ttf'); 

        // Create an SVG to overlay text. This gives us control over styling.
        const svgText = `
        <svg width="1200" height="630">
            <style>
                .title { fill: #ffffff; font-size: 70px; font-family: Inter; font-weight: bold; }
                .subtitle { fill: #ffffff; font-size: 45px; font-family: Inter; }
            </style>
            <text x="50%" y="45%" text-anchor="middle" class="title">I PLEDGED TO VOTE</text>
            <text x="50%" y="58%" text-anchor="middle" class="subtitle">in ${stateName}!</text>
        </svg>
        `;
        const svgBuffer = Buffer.from(svgText);

        // Use sharp to composite the SVG text over the template image
        const imageBuffer = await sharp(templatePath)
            .composite([{ input: svgBuffer, fontFile: fontPath }])
            .png()
            .toBuffer();

        // Set the content-type header to tell the browser it's an image
        res.setHeader('Content-Type', 'image/png');
        res.send(imageBuffer);

    } catch (err) {
        console.error("Error generating image:", err);
        res.status(500).json({ message: "Error generating image" });
    }
});


// --- Start the Server ---
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});