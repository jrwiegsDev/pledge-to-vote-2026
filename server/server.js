require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const sharp = require('sharp');
const path = require('path');
// --- 1. ADD NEW DEPENDENCIES ---
const http = require('http');
const { Server } = require("socket.io");

const app = express();
// --- 2. CREATE HTTP SERVER FOR WEBSOCKETS ---
const server = http.createServer(app);

// --- 3. INITIALIZE SOCKET.IO ---
const io = new Server(server, {
  cors: {
    origin: "*", // Allows your React app to connect
    methods: ["GET", "POST"]
  }
});

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
// NOTE: I've collapsed these for brevity, your actual code is still here.
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
app.get('/api/pledges/count', async (req, res) => {
    try {
        const totalPledges = await Pledge.countDocuments();
        res.json({ totalPledges });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching pledge count' });
    }
});
app.get('/api/pledges/by-state', async (req, res) => {
    try {
        const pledgesByState = await Pledge.aggregate([
            { $group: { _id: "$state", count: { $sum: 1 } } },
            { $project: { state: "$_id", count: 1, _id: 0 } }
        ]);
        res.json(pledgesByState);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching state data' });
    }
});
app.get('/api/share/image/:stateAbbr.png', async (req, res) => {
    try {
        const { stateAbbr } = req.params;
        const stateName = stateNames[stateAbbr.toUpperCase()] || 'this election';
        const templatePath = path.join(__dirname, 'share-template.png');
        const fontPath = path.join(__dirname, 'Inter-VariableFont_opsz,wght.ttf');
        const svgText = `<svg width="1200" height="630"><style>.line1 { fill: #ffffff; font-size: 65px; font-family: Inter; font-weight: bold; }.line2 { fill: #ffffff; font-size: 50px; font-family: Inter; font-weight: normal; }.line3 { fill: #ffffff; font-size: 80px; font-family: Inter; font-weight: bold; }</style><text x="50%" y="35%" text-anchor="middle" class="line1">I PLEDGED TO VOTE</text><text x="50%" y="52%" text-anchor="middle" class="line2">in the 2026 Midterms</text><text x="50%" y="75%" text-anchor="middle" class="line3">in ${stateName}!</text></svg>`;
        const svgBuffer = Buffer.from(svgText);
        const imageBuffer = await sharp(templatePath)
            .composite([{ input: svgBuffer, fontFile: fontPath }])
            .png()
            .toBuffer();
        res.setHeader('Content-Type', 'image/png');
        res.send(imageBuffer);
    } catch (err) {
        console.error("Error generating image:", err);
        res.status(500).json({ message: "Error generating image" });
    }
});

// --- 4. ADD WEBSOCKET LOGIC ---
let activeUsers = 0;

io.on('connection', (socket) => {
  activeUsers++;
  io.emit('userCountUpdate', activeUsers); // Broadcast to all clients
  console.log(`A user connected. Active users: ${activeUsers}`);

  socket.on('disconnect', () => {
    activeUsers--;
    io.emit('userCountUpdate', activeUsers); // Broadcast to all clients
    console.log(`A user disconnected. Active users: ${activeUsers}`);
  });
});


// --- 5. START THE SERVER (using the new 'server' object) ---
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});