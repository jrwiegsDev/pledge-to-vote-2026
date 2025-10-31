// server/autoPledge.js
// Automatically adds random pledges daily until the election

require('dotenv').config();
const mongoose = require('mongoose');

// Define the Pledge schema (same as in server.js)
const pledgeSchema = new mongoose.Schema({
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Pledge = mongoose.model('Pledge', pledgeSchema);

// Real state-zipcode combinations
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

// Function to get a random element from an array
const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Function to generate random pledges
const generateRandomPledges = () => {
  const pledges = [];
  const numPledges = Math.floor(Math.random() * 5) + 1; // Random 1-5
  
  for (let i = 0; i < numPledges; i++) {
    const stateCombo = getRandomElement(validStateCombos);
    const zipCode = getRandomElement(stateCombo.zips);
    pledges.push({
      state: stateCombo.state,
      zipCode: zipCode
    });
  }
  
  return pledges;
};

// Main function
async function addAutoPledges() {
  try {
    // Check if we're past the election date
    const electionDay = new Date('2026-11-03T00:00:00');
    const now = new Date();
    
    if (now >= electionDay) {
      console.log('🗳️  Election day has passed! Auto-pledge stopped.');
      return;
    }
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
    
    // Generate random pledges
    const newPledges = generateRandomPledges();
    console.log(`📝 Generating ${newPledges.length} random pledge(s)...`);
    
    // Insert pledges
    await Pledge.insertMany(newPledges);
    
    const totalPledges = await Pledge.countDocuments();
    console.log(`✅ Successfully added ${newPledges.length} pledge(s)!`);
    console.log(`📊 Total pledges now: ${totalPledges}`);
    
    // Log what was added
    newPledges.forEach((pledge, index) => {
      console.log(`   ${index + 1}. ${pledge.state} - ${pledge.zipCode}`);
    });
    
  } catch (error) {
    console.error('❌ Error adding auto pledges:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run the function
addAutoPledges();
