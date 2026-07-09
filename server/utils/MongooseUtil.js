//CLI: npm install mongoose --save
const mongoose = require("mongoose");
const MyConstants = require("./MyConstants");
// Prefer explicit URI when provided to avoid mismatched params
const uri =
  MyConstants.DB_URI ||
  "mongodb+srv://" +
    encodeURIComponent(MyConstants.DB_USER) +
    ":" +
    encodeURIComponent(MyConstants.DB_PASS) +
    "@" +
    MyConstants.DB_SERVER +
    "/" +
    MyConstants.DB_DATABASE;

mongoose
  .connect(uri)
  .then(() => {
    console.log("Connected to " + uri);
    // Migration: Set default quantity for existing products if not set
    mongoose.connection.db.collection('products').updateMany(
      { quantity: { $exists: false } },
      { $set: { quantity: 10 } }
    ).then((res) => {
      if (res.modifiedCount > 0) {
        console.log(`Migration: Updated ${res.modifiedCount} products with default quantity of 10.`);
      }
    }).catch((err) => {
      console.error("Migration error:", err);
    });
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });
