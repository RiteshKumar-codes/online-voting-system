
const db = require("../config/db");

// Create election
const createElection = async (req, res) => {
    try {
        const {
            title,
            description,
            start_date,
            end_date
        } = req.body;

        if (!title || !start_date || !end_date) {
            return res.status(400).json({
                message: "Title, start date and end date are required"
            });
        }

        if (new Date(start_date) >= new Date(end_date)) {
            return res.status(400).json({
                message: "End date must be after start date"
            });
        }

        const sql = `
            INSERT INTO elections
            (title, description, start_date, end_date, status)
            VALUES (?, ?, ?, ?, 'upcoming')
        `;

        const [result] = await db.execute(sql, [
            title,
            description || null,
            start_date,
            end_date
        ]);

        return res.status(201).json({
            message: "Election created successfully",
            electionId: result.insertId
        });

    } catch (error) {
        console.error("Create election error:", error);

        return res.status(500).json({
            message: "Failed to create election"
        });
    }
};


// Get all elections
const getAllElections = async (req, res) => {
    try {
        const [elections] = await db.execute(`
            SELECT
                id,
                title,
                description,
                start_date,
                end_date,
                status
            FROM elections
        `);

        return res.status(200).json({
            success: true,
            count: elections.length,
            elections
        });

    } catch (error) {
        console.error("Get elections error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch elections"
        });
    }
};


// Get election by ID
const getElectionById = async (req, res) => {
    try {
        const { id } = req.params;

        const sql = `
            SELECT
                id,
                title,
                description,
                start_date,
                end_date,
                status,
                created_at
            FROM elections
            WHERE id = ?
        `;

        const [results] = await db.execute(sql, [id]);

        if (results.length === 0) {
            return res.status(404).json({
                message: "Election not found"
            });
        }

        return res.status(200).json({
            election: results[0]
        });

    } catch (error) {
        console.error("Get election error:", error);

        return res.status(500).json({
            message: "Failed to fetch election"
        });
    }
};


// Update election
const updateElection = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            title,
            description,
            start_date,
            end_date,
            status
        } = req.body;

        if (!title || !start_date || !end_date || !status) {
            return res.status(400).json({
                message: "Title, dates and status are required"
            });
        }

        if (new Date(start_date) >= new Date(end_date)) {
            return res.status(400).json({
                message: "End date must be after start date"
            });
        }

        const sql = `
            UPDATE elections
            SET
                title = ?,
                description = ?,
                start_date = ?,
                end_date = ?,
                status = ?
            WHERE id = ?
        `;

        const [result] = await db.execute(sql, [
            title,
            description || null,
            start_date,
            end_date,
            status,
            id
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Election not found"
            });
        }

        return res.status(200).json({
            message: "Election updated successfully"
        });

    } catch (error) {
        console.error("Update election error:", error);

        return res.status(500).json({
            message: "Failed to update election"
        });
    }
};


// Delete election
const deleteElection = async (req, res) => {
    try {
        const { id } = req.params;

        const sql = `
            DELETE FROM elections
            WHERE id = ?
        `;

        const [result] = await db.execute(sql, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Election not found"
            });
        }

        return res.status(200).json({
            message: "Election deleted successfully"
        });

    } catch (error) {
        console.error("Delete election error:", error);

        return res.status(500).json({
            message: "Failed to delete election"
        });
    }
};


module.exports = {
    createElection,
    getAllElections,
    getElectionById,
    updateElection,
    deleteElection
};