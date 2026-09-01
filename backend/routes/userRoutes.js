const express = require("express");

const authenticateUser = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/profile", authenticateUser, (req, res) => {
    res.json({
        message: "Protected profile route accessed",
        user: req.user
    });
});

module.exports = router;