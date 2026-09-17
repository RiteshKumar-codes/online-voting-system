const express = require("express");
const router = express.Router();

const {getElectionResults} = require("../controllers/resultController");

const authenticateUser = require("../middleware/authMiddleware");

router.get("/election/:electionId", authenticateUser, getElectionResults);

module.exports = router;