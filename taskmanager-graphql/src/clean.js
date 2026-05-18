// src/clean.js
require("dotenv").config();
const connectDB = require("./config/db");
const User = require("./models/User");

async function clean() {
    await connectDB();
    await User.deleteMany({});
    console.log("✅ Usuarios eliminados");
    process.exit(0);
}

clean();
