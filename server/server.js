require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const sharp = require('sharp');
const path = require('path');
const cron = require('node-cron');
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

// --- AUTO-PLEDGE CRON JOB ---
// Valid state-zipcode combinations
const validStateCombos = [
  { state: 'AL', zips: ['35201', '35801', '36101', '36602'] },
  { state: 'AK', zips: ['99501', '99701', '99801'] },
  { state: 'AZ', zips: ['85001', '85201', '85701', '86001'] },
  { state: 'AR', zips: ['72201', '72701', '72901'] },
  { state: 'CA', zips: ['90001', '90210', '94102', '92101', '95101', '93101'] },
  { state: 'CO', zips: ['80201', '80302', '80901'] },
  { state: 'CT', zips: ['06101', '06510', '06850'] },
  { state: 'DE', zips: ['19701', '19801', '19901'] },
  { state: 'FL', zips: ['32301', '32801', '33101', '33601'] },
  { state: 'GA', zips: ['30301', '31401', '30901'] },
  { state: 'HI', zips: ['96801', '96720'] },
  { state: 'ID', zips: ['83701', '83401', '83201'] },
  { state: 'IL', zips: ['60601', '62249', '61801', '62701'] },
  { state: 'IN', zips: ['46201', '46802', '47401'] },
  { state: 'IA', zips: ['50301', '52401', '51501'] },
  { state: 'KS', zips: ['66101', '67201', '66502'] },
  { state: 'KY', zips: ['40201', '40502', '42101'] },
  { state: 'LA', zips: ['70112', '70801', '71101'] },
  { state: 'ME', zips: ['04101', '04401', '04330'] },
  { state: 'MD', zips: ['21201', '20601', '21401'] },
  { state: 'MA', zips: ['02101', '02138', '01001'] },
  { state: 'MI', zips: ['48201', '48823', '49503'] },
  { state: 'MN', zips: ['55401', '55801', '55901'] },
  { state: 'MS', zips: ['39201', '39501', '38801'] },
  { state: 'MO', zips: ['63101', '64101', '65801'] },
  { state: 'MT', zips: ['59601', '59101', '59801'] },
  { state: 'NE', zips: ['68101', '68501', '69101'] },
  { state: 'NV', zips: ['89101', '89501', '89701'] },
  { state: 'NH', zips: ['03101', '03301', '03801'] },
  { state: 'NJ', zips: ['07002', '08608', '07601'] },
  { state: 'NM', zips: ['87101', '88001', '87401'] },
  { state: 'NY', zips: ['10001', '11201', '14201', '13201'] },
  { state: 'NC', zips: ['27601', '28201', '27401'] },
  { state: 'ND', zips: ['58501', '58101', '58201'] },
  { state: 'OH', zips: ['43215', '44101', '45201'] },
  { state: 'OK', zips: ['73101', '74101', '73401'] },
  { state: 'OR', zips: ['97201', '97401', '97301'] },
  { state: 'PA', zips: ['19019', '15201', '17101'] },
  { state: 'RI', zips: ['02901', '02840', '02860'] },
  { state: 'SC', zips: ['29201', '29401', '29301'] },
  { state: 'SD', zips: ['57501', '57101', '57701'] },
  { state: 'TN', zips: ['37201', '37901', '38101'] },
  { state: 'TX', zips: ['75201', '78701', '77001', '79901'] },
  { state: 'UT', zips: ['84101', '84601', '84010'] },
  { state: 'VT', zips: ['05401', '05601', '05701'] },
  { state: 'VA', zips: ['22201', '23219', '24011'] },
  { state: 'WA', zips: ['98101', '99201', '98501'] },
  { state: 'WV', zips: ['25301', '26501', '25401'] },
  { state: 'WI', zips: ['53201', '53701', '54701'] },
  { state: 'WY', zips: ['82001', '82601', '82801'] }
];

const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Schedule cron job to run daily at 3:00 AM
cron.schedule('0 3 * * *', async () => {
  try {
    const electionDay = new Date('2026-11-03T00:00:00');
    const now = new Date();
    
    if (now >= electionDay) {
      console.log('🗳️  Election day has passed! Auto-pledge stopped.');
      return;
    }
    
    const numPledges = Math.floor(Math.random() * 5) + 1;
    const newPledges = [];
    
    for (let i = 0; i < numPledges; i++) {
      const stateCombo = getRandomElement(validStateCombos);
      const zipCode = getRandomElement(stateCombo.zips);
      newPledges.push({ state: stateCombo.state, zipCode });
    }
    
    await Pledge.insertMany(newPledges);
    const totalPledges = await Pledge.countDocuments();
    
    console.log(`🤖 Auto-pledge: Added ${numPledges} pledge(s). Total: ${totalPledges}`);
  } catch (error) {
    console.error('❌ Auto-pledge error:', error);
  }
});


// --- 5. START THE SERVER (using the new 'server' object) ---
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});