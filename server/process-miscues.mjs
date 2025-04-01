import { assessAttempt } from '../src/utils/assessAttempt.js';
import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const uri = process.env.MONGO_URI;

if (!uri) {
  console.error("MONGO_URI is not set in environment variables.");
  process.exit(1);
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const dbName = "textcomplexitydb";

async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB.");

    const db = client.db(dbName);
    const attemptsCollection = db.collection("readingAssessmentAttempts");

    const allAttempts = await attemptsCollection.find().toArray();
    let updatedCount = 0;

    for (const attempt of allAttempts) {
      if (!Array.isArray(attempt.readingAttempts)) continue;

      let hasUpdates = false;

      const updatedSegments = attempt.readingAttempts.map((segment) => {
        const { readingContent, rawAttempt } = segment;

        if (
          !readingContent ||
          !rawAttempt ||
          typeof readingContent !== "string" ||
          typeof rawAttempt !== "string"
        ) {
          return segment;
        }

        if (segment.miscueResult) return segment; // Already has result

        try {
          const result = assessAttempt(readingContent, rawAttempt);
          hasUpdates = true;
          return { ...segment, miscueResult: result };
        } catch (err) {
          console.warn("Failed to assess segment:", err.message);
          return segment;
        }
      });

      if (hasUpdates) {
        await attemptsCollection.updateOne(
          { _id: attempt._id },
          { $set: { readingAttempts: updatedSegments } }
        );
        updatedCount++;
      }
    }

    console.log(`Precomputed miscues for ${updatedCount} documents.`);
  } catch (err) {
    console.error("Error during processing:", err);
  } finally {
    await client.close();
  }
}

run();
