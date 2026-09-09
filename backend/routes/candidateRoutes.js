const express = require("express");
const router = express.Router();

const {
    createCandidate,
    getAllCandidates,
    getCandidatesByElection,
    updateCandidate,
    deleteCandidate
} = require("../controllers/candidateCottroller");

const authenticateUser = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");

// Admin creates candidate

router.post("/",authenticateUser, isAdmin, createCandidate);

//Get all candidates

router.get("/", authenticateUser, getAllCandidates);

// Get candidates of specific election
router.get(
    "/election/:electionId",
    authenticateUser,
    getCandidatesByElection
);


// Admin updates candidate
router.put(
    "/:id",
    authenticateUser,
    isAdmin,
    updateCandidate
);


// Admin deletes candidate
router.delete(
    "/:id",
    authenticateUser,
    isAdmin,
    deleteCandidate
);


module.exports = router;