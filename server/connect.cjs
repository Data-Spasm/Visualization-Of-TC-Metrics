require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

// Load URI from .env
const uri = process.env.MONGO_URI;

if (!uri) {
  console.error("MONGO_URI not found in environment variables.");
  process.exit(1);
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. Successfully connected to MongoDB!");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
