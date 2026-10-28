const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });
const mongoose = require('mongoose');
const Employee = require('../models/Employee');

const seedEmployees = [
  {
    name: 'Sarah Connor',
    email: 'sarah.connor@company.com',
    department: 'Engineering',
    designation: 'Senior Full Stack Engineer',
  },
  {
    name: 'Michael Scott',
    email: 'michael.scott@company.com',
    department: 'Sales',
    designation: 'Regional Sales Manager',
  },
  {
    name: 'Elena Rostova',
    email: 'elena.rostova@company.com',
    department: 'Product',
    designation: 'Lead Product Designer',
  },
  {
    name: 'David Kim',
    email: 'david.kim@company.com',
    department: 'Engineering',
    designation: 'DevOps & Cloud Architect',
  },
  {
    name: 'Priya Sharma',
    email: 'priya.sharma@company.com',
    department: 'Human Resources',
    designation: 'HR Operations Lead',
  },
  {
    name: 'Marcus Vance',
    email: 'marcus.vance@company.com',
    department: 'Marketing',
    designation: 'Content & Brand Strategist',
  },
  {
    name: 'Jessica Chen',
    email: 'jessica.chen@company.com',
    department: 'Finance',
    designation: 'Financial Analyst',
  },
  {
    name: 'Alexander Hayes',
    email: 'alexander.hayes@company.com',
    department: 'Operations',
    designation: 'IT Systems Administrator',
  },
];

const seedDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('❌ MONGODB_URI is not set in server/.env. Cannot seed database.');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log(`Connected to MongoDB for seeding.`);

    // Clear existing records
    const deleteResult = await Employee.deleteMany({});
    console.log(`Cleared ${deleteResult.deletedCount} existing employee records.`);

    // Insert sample records
    const inserted = await Employee.insertMany(seedEmployees);
    console.log(`✅ Successfully seeded ${inserted.length} sample employee records:`);
    inserted.forEach((emp) => {
      console.log(`   - ${emp.name} (${emp.designation} - ${emp.department})`);
    });

    console.log('\nSeed completed successfully.');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedDB();
