const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Shavya@77",
    database: "voting_system"
});

connection.connect((err) => {
    if(err){
        console.error("Database connection failed:", err.message);
        return;
    }
    console.log("MySQL connected succesfully");
});

module.exports = connection;