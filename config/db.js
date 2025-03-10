const mongoose = require("mongoose");

const cloudDatabaseUrl = process.env.ATLAS_DB_URL;

async function connectDB() {
    try {
        await mongoose.connect(cloudDatabaseUrl);
        console.log("✅ Database connected successfully.");
    } catch (error) {
        console.error("❌ Database connection failed:", error);
        process.exit(1); // Exit if the database connection fails
    }
}

module.exports = connectDB;
