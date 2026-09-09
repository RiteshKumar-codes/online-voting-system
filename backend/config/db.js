const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

async function testConnection() {
    try {
        const connection = await db.getConnection();

        console.log("MySQL connected successfully");

        connection.release();
    } catch (error) {
        console.error("Database connection failed:", error.message);
    }
}

testConnection();

module.exports = db;
