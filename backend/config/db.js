const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port:  Number(process.env.DB_PORT || 3306),
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,

    ssl: process.env.DB_SSL === "true"
        ? {
            minVersion: "TLSv1.2"
        }
        : undefined
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
