const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const db = require("./config/db");
const app = express();
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const electionRoutes = require("./routes/electionRoutes");
const candidateRoutes = require("./routes/candidateRoutes");
const voteRoutes = require("./routes/voteRoutes");
const resultRoutes = require("./routes/resultRoutes");

const cors = require("cors");

const allowedOrigins = [
    "http://127.0.0.1:5500",
    "http://localhost:5500",
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {

        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error("Not allowed by CORS"));
    }
}));


const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use("/api/auth/", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/elections", electionRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/votes", voteRoutes);
app.use("/api/results", resultRoutes);

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

app.listen(PORT, "0.0.0.0", () => {
    console.log(`server is running on ${PORT}`);
});
