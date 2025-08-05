import * as functions from "firebase-functions";
import * as express from "express";
import * as cors from "cors";
import * as admin from "firebase-admin";

// Initialize firebase-admin once for both local and deployed environments
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

const api = express();
api.use(cors());

// GET /projects - returns up to 8 ordered projects
api.get("/projects", async (_req, res) => {
  try {
    const snap = await db
      .collection("projects")
      .orderBy("order", "asc")
      .limit(8)
      .get();
    const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(data);
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

// GET /experiences - returns up to 3 ordered experiences
api.get("/experiences", async (_req, res) => {
  try {
    const snap = await db
      .collection("experiences")
      .orderBy("order", "asc")
      .limit(3)
      .get();
    const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(data);
  } catch (err) {
    console.error("Error fetching experiences:", err);
    res.status(500).json({ error: "Failed to fetch experiences" });
  }
});

// GET /achievements - returns up to 8 ordered achievements
api.get("/achievements", async (_req, res) => {
  try {
    const snap = await db
      .collection("achievements")
      .orderBy("order", "asc")
      .limit(8)
      .get();
    const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(data);
  } catch (err) {
    console.error("Error fetching achievements:", err);
    res.status(500).json({ error: "Failed to fetch achievements" });
  }
});

// (Optional) Placeholder route for health checks, keep last
api.get("/", (_req, res) => {
  res.send({ status: "API scaffold ready" });
});

exports.api = functions.https.onRequest(api);