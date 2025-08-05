// Express app placeholder for Firebase Functions backend
// TODO: Implement /api/projects, /api/experiences, /api/achievements endpoints

import * as functions from "firebase-functions";
import * as express from "express";
import * as cors from "cors";

const api = express();
api.use(cors());

// Placeholder route
api.get("/", (_req, res) => {
  res.send({ status: "API scaffold ready" });
});

exports.api = functions.https.onRequest(api);