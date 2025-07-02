import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI, {
});

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { db: cachedDb, client: cachedClient }; // Return cached client and database if already connected
  }

  try {
    // Connect to MongoDB if not already connected
    await client.connect(); // Ensures that the client is connected
    const db = client.db(); // Access the default database (as per the connection string)
    
    cachedClient = client;
    cachedDb = db;

    return { db, client };
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw new Error('Failed to connect to MongoDB');
  }
}
