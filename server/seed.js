// server/seed.js
// Script to seed the database with initial pledge data

require('dotenv').config();
const mongoose = require('mongoose');

// Define the Pledge schema (same as in server.js)
const pledgeSchema = new mongoose.Schema({
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Pledge = mongoose.model('Pledge', pledgeSchema);

// Sample seed data - mix of states to populate the map
const samplePledges = [
  // Some variety across different states
  { state: 'CA', zipCode: '90210' },
  { state: 'CA', zipCode: '94102' },
  { state: 'CA', zipCode: '92101' },
  { state: 'NY', zipCode: '10001' },
  { state: 'NY', zipCode: '11201' },
  { state: 'TX', zipCode: '75201' },
  { state: 'TX', zipCode: '78701' },
  { state: 'FL', zipCode: '33101' },
  { state: 'FL', zipCode: '32801' },
  { state: 'IL', zipCode: '60601' },
  { state: 'IL', zipCode: '62249' },
  { state: 'PA', zipCode: '19019' },
  { state: 'OH', zipCode: '43215' },
  { state: 'GA', zipCode: '30301' },
  { state: 'NC', zipCode: '27601' },
  { state: 'MI', zipCode: '48201' },
  { state: 'NJ', zipCode: '07002' },
  { state: 'VA', zipCode: '22201' },
  { state: 'WA', zipCode: '98101' },
  { state: 'MA', zipCode: '02101' },
  { state: 'AZ', zipCode: '85001' },
  { state: 'TN', zipCode: '37201' },
  { state: 'IN', zipCode: '46201' },
  { state: 'MO', zipCode: '63101' },
  { state: 'MD', zipCode: '21201' },
  { state: 'WI', zipCode: '53201' },
  { state: 'CO', zipCode: '80201' },
  { state: 'MN', zipCode: '55401' },
  { state: 'SC', zipCode: '29201' },
  { state: 'AL', zipCode: '35201' },
  { state: 'LA', zipCode: '70112' },
  { state: 'KY', zipCode: '40201' },
  { state: 'OR', zipCode: '97201' },
  { state: 'OK', zipCode: '73101' },
  { state: 'CT', zipCode: '06101' },
  { state: 'IA', zipCode: '50301' },
  { state: 'MS', zipCode: '39201' },
  { state: 'AR', zipCode: '72201' },
  { state: 'KS', zipCode: '66101' },
  { state: 'UT', zipCode: '84101' },
  { state: 'NV', zipCode: '89101' },
  { state: 'NM', zipCode: '87101' },
  { state: 'WV', zipCode: '25301' },
  { state: 'NE', zipCode: '68101' },
  { state: 'ID', zipCode: '83701' },
  { state: 'HI', zipCode: '96801' },
  { state: 'NH', zipCode: '03101' },
  { state: 'ME', zipCode: '04101' },
  { state: 'RI', zipCode: '02901' },
  { state: 'MT', zipCode: '59601' },
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Check if data already exists
    const existingCount = await Pledge.countDocuments();
    console.log(`📊 Current pledge count: ${existingCount}`);

    if (existingCount > 0) {
      console.log('⚠️  Database already has pledges. Do you want to:');
      console.log('   1. Keep existing data and add seed data');
      console.log('   2. Clear all data and reseed');
      console.log('   3. Cancel');
      console.log('\nTo clear and reseed, run: node seed.js --reset');
      
      // Check if --reset flag is provided
      if (process.argv.includes('--reset')) {
        await Pledge.deleteMany({});
        console.log('🗑️  Cleared existing pledges');
      } else {
        console.log('➕ Adding seed data to existing pledges...');
      }
    }

    // Insert seed data
    await Pledge.insertMany(samplePledges);
    const newCount = await Pledge.countDocuments();
    console.log(`✅ Successfully seeded database!`);
    console.log(`📊 Total pledges now: ${newCount}`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run the seed function
seedDatabase();
