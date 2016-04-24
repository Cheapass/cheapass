import mongoose from 'mongoose';
const dbPath = 'mongodb://localhost/streetsmart-production';
const db = mongoose.createConnection(dbPath);

db.on('error', () => {
  throw new Error(`unable to connect to database at ${dbPath}`);
});


export default db;
