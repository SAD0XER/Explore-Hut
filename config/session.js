const MongoStore = require("connect-mongo");

const store = MongoStore.create({
    mongoUrl: process.env.ATLAS_DB_URL,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600, // Reduce session updates to improve performance
});

store.on("error", (error) => {
    console.error("❌ ERROR in MONGO SESSION STORE:", error);
});

module.exports = store;
