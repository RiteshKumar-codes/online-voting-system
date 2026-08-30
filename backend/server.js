const express = require("express");

const db = require("./config/db");
const app = express();
const authRoutes = require("./routes/authRoutes");


const PORT = 5000;

app.use(express.json());
app.use("/api/auth/", authRoutes);

app.get("/", (req, res) => {
    res.send("Online Voting System is Running");
});

app.get("/api/test-db", (req,res) => {
    db.query("SELECT 1 AS result", (err, result) => {
        if(err){
            return res.status(500).json({
                message: "Database error",
                error: err.message
            });
        }

        res.json({
            message: "Database connected successfully",
            result: result
        });
    });
});

app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
});
