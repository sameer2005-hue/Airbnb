require("dotenv").config(); // ✅ Must be first line

const mongoose = require("mongoose");
const Listing = require("../models/listing"); // adjust path if needed
const data = require("./data");

const MONGO_URL = process.env.ATLASDB_URL || process.env.MONGO_URL; // ✅ using your .env variable name

console.log("MONGO_URL from .env:", MONGO_URL); // 🧠 debug line

async function main() {
  if (!MONGO_URL) {
    throw new Error("❌ MONGO_URL is undefined! Check your .env file and path.");
  }

  await mongoose.connect(MONGO_URL);
  console.log("✅ Connected to MongoDB Atlas");

  await Listing.deleteMany({});
  console.log("🗑️ Old listings deleted");

  await Listing.insertMany(data.data);
  console.log("🌱 Data seeded successfully");

  await mongoose.connection.close();
  console.log("🔒 MongoDB connection closed");
}

main().catch((err) => console.error("❌ Error seeding data:", err));
