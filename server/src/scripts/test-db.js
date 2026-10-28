const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });
const mongoose = require('mongoose');

const testConnection = async () => {
  const uri = process.env.MONGODB_URI;

  console.log('\n--- MongoDB Connection Test ---');

  if (!uri) {
    console.error('❌ MONGODB_URI is not set in server/.env.');
    console.error('   Please add MONGODB_URI to your server/.env file.\n');
    process.exit(1);
  }

  // Sanitize URI for display (hide credentials)
  const sanitizedUri = uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
  console.log(`Connecting to: ${sanitizedUri}`);

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log('✅ Connection successful!');
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Database Name: ${conn.connection.name}`);
    console.log(`   Ready State: ${conn.connection.readyState === 1 ? 'Connected (1)' : conn.connection.readyState}`);
    console.log('--------------------------------\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Connection failed:');
    console.error(`   Error message: ${error.message}\n`);

    console.log('Common MongoDB Atlas troubleshooting tips:');
    console.log('1. IP Whitelist: In MongoDB Atlas -> Network Access -> ensure your current IP address (or 0.0.0.0/0) is allowed.');
    console.log('2. User Credentials: In MongoDB Atlas -> Database Access -> verify the username and password.');
    console.log('3. Password Special Characters: If your password contains special characters (like @, #, $, %), URL-encode them.');
    console.log('4. Database Name: Ensure a database name is specified before the query string, e.g. /employee_management?retryWrites=true...\n');

    await mongoose.disconnect().catch(() => {});
    process.exit(1);
  }
};

testConnection();
