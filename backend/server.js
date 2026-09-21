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

app.use(express.json());
app.use(cors({
  origin: "https://online-voting-system-1-pttx.onrender.com", // no trailing slash
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
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
