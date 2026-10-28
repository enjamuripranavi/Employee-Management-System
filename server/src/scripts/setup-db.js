const fs = require('fs');
const path = require('path');
const readline = require('readline');
const mongoose = require('mongoose');

const envPath = path.join(__dirname, '..', '..', '.env');

// Helper to mask URI credentials
const maskUri = (uri) => {
  return uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@');
};

// Helper to ensure database name 'employee_management' is included
const formatUri = (rawUri) => {
  let uri = rawUri.trim().replace(/^['"]|['"]$/g, ''); // strip outer quotes if any

  // Check if database name exists
  // Pattern: mongodb+srv://host/database?options or mongodb://host/database?options
  const match = uri.match(/^(mongodb(?:\+srv)?:\/\/[^/?]+)(?:\/([^?]*))?(\?.*)?$/);

  if (match) {
    const base = match[1];
    let dbName = match[2];
    const query = match[3] || '?retryWrites=true&w=majority';

    if (!dbName || dbName.trim() === '') {
      dbName = 'employee_management';
    }

    return `${base}/${dbName}${query.startsWith('?') ? query : '?' + query}`;
  }

  return uri;
};

const saveAndTest = async (rawUri) => {
  if (!rawUri || !rawUri.trim()) {
    console.error('❌ No connection string provided. Aborted.');
    process.exit(1);
  }

  const formattedUri = formatUri(rawUri);
  const maskedUri = maskUri(formattedUri);

  console.log('\n1. Saving configuration to server/.env...');

  // Preserve PORT and NODE_ENV
  const envContent = `PORT=5000\nNODE_ENV=development\nMONGODB_URI=${formattedUri}\n`;

  try {
    fs.writeFileSync(envPath, envContent, 'utf8');
    console.log('   ✅ Saved server/.env successfully.');
    console.log(`   Configured URI: ${maskedUri}`);
  } catch (err) {
    console.error('   ❌ Failed to write to server/.env:', err.message);
    process.exit(1);
  }

  console.log('\n2. Testing MongoDB Atlas connection...');

  try {
    const conn = await mongoose.connect(formattedUri, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log('   ✅ Connection successful!');
    console.log(`   Cluster Host: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);
    console.log('   Status: Ready\n');

    console.log('🎉 Setup complete! You can now start the application:');
    console.log('   Backend:  npm.cmd run dev');
    console.log('   Frontend: cd ../client && npm.cmd run dev\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('   ❌ Connection test failed:');
    console.error(`   ${err.message}\n`);

    console.log('Troubleshooting tips:');
    console.log('- IP Whitelist: Ensure your current IP is allowed in MongoDB Atlas (Network Access -> Add IP -> 152.57.231.78 or 0.0.0.0/0).');
    console.log('- Database User: Ensure the username and password match a user created in Database Access.');
    console.log('- Special Characters: If the password contains @, #, $, or %, ensure they are URL-encoded.\n');

    await mongoose.disconnect().catch(() => {});
    process.exit(1);
  }
};

// Check if passed via command line argument
const cliArg = process.argv.slice(2).join(' ');
if (cliArg && cliArg.trim()) {
  saveAndTest(cliArg);
} else {
  // Interactive readline prompt
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log('\n========================================');
  console.log('   MongoDB Atlas Secure Setup Utility   ');
  console.log('========================================');
  console.log('Paste your MongoDB Atlas connection string below and press Enter.');
  console.log('(It will be written directly to server/.env and tested immediately)\n');

  rl.question('MongoDB Atlas URI: ', (answer) => {
    rl.close();
    saveAndTest(answer);
  });
}
