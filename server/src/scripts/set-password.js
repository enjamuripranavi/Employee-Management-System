const fs = require('fs');
const path = require('path');
const readline = require('readline');
const mongoose = require('mongoose');

const envPath = path.join(__dirname, '..', '..', '.env');

const updatePassword = async (rawPassword) => {
  if (!rawPassword || !rawPassword.trim()) {
    console.error('❌ Password cannot be empty.');
    process.exit(1);
  }

  const password = rawPassword.trim();
  const encodedPassword = encodeURIComponent(password);

  // Read current .env
  let currentEnv = '';
  try {
    currentEnv = fs.readFileSync(envPath, 'utf8');
  } catch (err) {
    console.error('❌ Could not read server/.env:', err.message);
    process.exit(1);
  }

  // Extract cluster and username from current MONGODB_URI or use known values
  let username = 'enjamuripranavi965_db_user';
  let cluster = 'buildemployeesystem.jlegrxs.mongodb.net';
  let dbName = 'employee_management';

  const uriMatch = currentEnv.match(/MONGODB_URI=mongodb(?:\+srv)?:\/\/([^:]+):([^@]+)@([^/?]+)(?:\/([^?]+))?/);
  if (uriMatch) {
    username = uriMatch[1] || username;
    cluster = uriMatch[3] || cluster;
    dbName = uriMatch[4] || dbName;
  }

  const newUri = `mongodb+srv://${username}:${encodedPassword}@${cluster}/${dbName}?retryWrites=true&w=majority`;

  // Update server/.env
  const updatedEnv = `PORT=5000\nNODE_ENV=development\nMONGODB_URI=${newUri}\n`;
  fs.writeFileSync(envPath, updatedEnv, 'utf8');

  console.log('\n✅ Updated password in server/.env.');
  console.log(`Connecting to: mongodb+srv://${username}:****@${cluster}/${dbName}...`);

  // Test connection
  try {
    const conn = await mongoose.connect(newUri, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log('\n🎉 Connection successful!');
    console.log(`   Cluster Host: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);
    console.log('   Ready State: Connected (1)\n');

    console.log('Setup is complete! You can now start the application:');
    console.log('   cd server && npm.cmd run dev');
    console.log('   cd client && npm.cmd run dev\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Connection still failed:');
    console.error(`   Error message: ${err.message}\n`);

    if (err.message.includes('bad auth')) {
      console.log('⚠️  Authentication failed. Please verify in MongoDB Atlas:');
      console.log('   1. Go to cloud.mongodb.com -> Database Access');
      console.log(`   2. Find user "${username}"`);
      console.log('   3. Click "Edit" -> "Edit Password" and enter this exact password');
      console.log('   4. Click "Update User" and wait 10-15 seconds for changes to deploy.\n');
    }

    await mongoose.disconnect().catch(() => {});
    process.exit(1);
  }
};

const cliArg = process.argv.slice(2).join(' ');
if (cliArg && cliArg.trim()) {
  updatePassword(cliArg);
} else {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log('\n=============================================');
  console.log('   Update MongoDB Atlas Password Utility     ');
  console.log('=============================================');
  console.log('Enter the password for user: enjamuripranavi965_db_user');

  rl.question('Password: ', (answer) => {
    rl.close();
    updatePassword(answer);
  });
}
