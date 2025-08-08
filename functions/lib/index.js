"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const functions = __importStar(require("firebase-functions"));
const express = __importStar(require("express"));
const cors = __importStar(require("cors"));
const admin = __importStar(require("firebase-admin"));
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
    }
    catch (err) {
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
    }
    catch (err) {
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
    }
    catch (err) {
        console.error("Error fetching achievements:", err);
        res.status(500).json({ error: "Failed to fetch achievements" });
    }
});
// (Optional) Placeholder route for health checks, keep last
api.get("/", (_req, res) => {
    res.send({ status: "API scaffold ready" });
});
exports.api = functions.https.onRequest(api);
