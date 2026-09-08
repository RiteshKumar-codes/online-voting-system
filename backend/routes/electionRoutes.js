const express = require("express");
const {
createElection,
    getAllElections,
    getElectionById,
    updateElection,
    deleteElection
} = require("../controllers/electionController");

const authenticateUser = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");
const router = express.Router();

// Public
router.get("/", getAllElections);
router.get("/:id", getElectionById);

//Admin only 
router.post("/", authenticateUser, isAdmin, createElection);
router.put("/:id", authenticateUser, isAdmin, updateElection);
router.delete("/:id", authenticateUser, isAdmin, deleteElection);

module.exports = router;