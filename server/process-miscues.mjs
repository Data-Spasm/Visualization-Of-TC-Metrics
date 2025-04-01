import { assessAttempt } from '../src/utils/assessAttempt.js';
import { MongoClient, ServerApiVersion } from 'mongodb';


const uri = "mongodb+srv://jonathanswamber2003:PR6aMw4u345v7fxT@cluster0.8rf33.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
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
    const db = client.db(dbName);
    const attemptsCollection = db.collection("readingAssessmentAttempts");

    const allAttempts = await attemptsCollection.find().toArray();
    let updatedCount = 0;

    for (const attempt of allAttempts) {
      if (!Array.isArray(attempt.readingAttempts)) continue;

      let updated = false;

      const updatedSegments = attempt.readingAttempts.map((segment) => {
        if (!segment.readingContent || !segment.rawAttempt || typeof segment.readingContent !== 'string' || typeof segment.rawAttempt !== 'string') {
          return segment;
        }
      
        if (segment.miscueResult) return segment;
      
        try {
          const result = assessAttempt(segment.readingContent, segment.rawAttempt);
          return { ...segment, miscueResult: result };
        } catch (err) {
          console.warn(`⚠️ Failed to process one segment:`, err.message);
          return segment; // Skip this one
        }
      });
      

      if (updated) {
        await attemptsCollection.updateOne(
          { _id: attempt._id },
          { $set: { readingAttempts: updatedSegments } }
        );
        updatedCount++;
      }
    }

    console.log(`\u2705 Precomputed miscues for ${updatedCount} documents.`);
  } catch (err) {
    console.error("\u274C Failed:", err);
  } finally {
    await client.close();
  }
}

run();
