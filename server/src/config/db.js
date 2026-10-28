const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });
const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn(
      '⚠️  MONGODB_URI is not defined in server/.env.\n' +
      '   Please configure MONGODB_URI in your server/.env file.\n' +
      '   Example for local MongoDB: mongodb://localhost:27017/employee_management\n' +
      '   Example for MongoDB Atlas: mongodb+srv://<user>:<password>@cluster0.mongodb.net/employee_management'
    );
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB connected successfully: ${conn.connection.host}/${conn.connection.name}`);
    return true;
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    console.error(
      '   To resolve this:\n' +
      '   1. Ensure MongoDB is running locally (e.g. run "mongod" or start the Windows MongoDB service)\n' +
      '   2. Or provide a free cloud MongoDB Atlas connection string in server/.env\n' +
      '   3. Check that the port and credentials in MONGODB_URI are correct'
    );
    return false;
  }
};

const isDBConnected = () => {
  return mongoose.connection.readyState === 1; // 1 = connected
};

module.exports = { connectDB, isDBConnected };
