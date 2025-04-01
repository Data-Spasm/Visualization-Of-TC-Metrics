const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config({ path: __dirname + '/.env' });


const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  'https://visualization-of-tc-metrics-2.onrender.com'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json());

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


async function main() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged MongoDB and connected successfully!");

    // USERS
    app.get('/api/users', async (req, res) => {
      const { teacher, role } = req.query;
      const db = client.db(dbName);
      const userCollection = db.collection("users");
    
      try {
        console.log("Incoming request to /api/users");
        console.log("Query params:", { teacher, role });
    
        // CASE 1: Fetch students by teacher username
        if (teacher) {
          const teacherDoc = await userCollection.findOne({ username: teacher });
          console.log("👩‍🏫 Found teacher document:", teacherDoc?.username);
    
          if (!teacherDoc || !teacherDoc.teacher || !Array.isArray(teacherDoc.teacher.studentNames)) {
            console.warn("⚠️ No studentNames found in teacher doc or invalid structure.");
            return res.json([]);
          }
    
          const studentUsernames = teacherDoc.teacher.studentNames;
          console.log(`Found ${studentUsernames.length} student usernames for teacher ${teacher}:`, studentUsernames);
    
          const query = { username: { $in: studentUsernames } };
          if (role) query.role = role;
    
          const students = await userCollection.find(query).toArray();
          console.log(`Matched ${students.length} students for teacher=${teacher}${role ? ` with role=${role}` : ""}`);
          return res.json(students);
        }
    
        // CASE 2: Fetch users by role
        const query = {};
        if (role) query.role = role;
    
        const users = await userCollection.find(query).toArray();
        console.log(`Returned ${users.length} users with${role ? ` role=${role}` : "out role filter"}`);
        res.json(users);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        res.status(500).json({ error: "Failed to fetch users" });
      }
    });
    
    

    app.get('/api/users/:username', async (req, res) => {
      const user = await client.db(dbName).collection("users").findOne({ username: req.params.username });
      res.json(user);
    });

    // ROLES
    app.get('/api/roles', async (req, res) => {
      const roles = await client.db(dbName).collection("roles").find().toArray();
      res.json(roles);
    });

    app.get('/api/roles/:id', async (req, res) => {
      const role = await client.db(dbName).collection("roles").findOne({ _id: new ObjectId(req.params.id) });
      res.json(role);
    });

    // AVATARS
    app.get('/api/avatars', async (req, res) => {
      const avatars = await client.db(dbName).collection("avatars").find().toArray();
      res.json(avatars);
    });

    app.get('/api/avatars/:id', async (req, res) => {
      const avatar = await client.db(dbName).collection("avatars").findOne({ _id: new ObjectId(req.params.id) });
      res.json(avatar);
    });

    // READING ASSESSMENTS
    app.get('/api/readingAssessments', async (req, res) => {
      const assessments = await client.db(dbName).collection("readingAssessments").find().toArray();
      res.json(assessments);
    });

    app.get('/api/readingAssessments/:id', async (req, res) => {
      const assessment = await client.db(dbName).collection("readingAssessments").findOne({ _id: new ObjectId(req.params.id) });
      res.json(assessment);
    });

    // READING ATTEMPTS
    app.get('/api/readingAssessmentAttempts', async (req, res) => {
      const query = {};
      if (req.query.student) query.studentUsername = req.query.student;
      if (req.query.assessment) query.readingAssessmentId = req.query.assessment;

      const attempts = await client.db(dbName).collection("readingAssessmentAttempts").find(query).toArray();
      res.json(attempts);
    });

    app.get('/api/readingAssessmentAttempts/:id', async (req, res) => {
      const attempt = await client.db(dbName).collection("readingAssessmentAttempts").findOne({ _id: new ObjectId(req.params.id) });
      res.json(attempt);
    });

    // Start the server
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
  }
}

main();
