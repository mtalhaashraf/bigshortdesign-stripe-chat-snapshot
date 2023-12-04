const admin = require("firebase-admin");
const app = admin.initializeApp();
const db = app.firestore();

module.exports = { admin, db };
