const db = require("../config/db");

// Create candidate
const createCandidate = async (req, res) => {
    try{
        const {
            election_id,
            name,
            description
        } = req.body;

        if(!election_id || !name){
            return res.status(400).json({
                message: "Election ID and Candidate name are required"
            });
        }

        //check whether election exists
        const [election] = await db.execute(
            "SELECT id FROM elections WHERE id = ?",
            [election_id]
        );

        if(election.length === 0){
            return res.status(404).json({
                message: "Election not found"
            });
        }

        const [result] = await db.execute(
            `INSERT INTO candidates
            (election_id, name, description)
            VALUES(?, ?, ?)
            `,
            [
                election_id,
                name,
                description || null
            ]
        );

        res.status(201).json({
            message: "Candidate created successfully",
            candidateId: result.insertId
        });
    } catch(error){
        console.error(error),
        res.status(500).json({
            message: "Server error"
        });
        
    }
};

// Get all candidates

const getAllCandidates = async (req, res) => {
    try{
        const [candidates] = await db.execute(
          `
          SELECT
          c.id,
          c.name,
          c.description,
          c.election_id,
          e.title AS election_title,
          c.created_at
          FROM candidates c
          INNER JOIN elections e
             ON c.election_id = e.id
             ORDER BY c.created_at DESC
          `
        );

        res.status(200).json({
            candidates
        });
    } catch(error){
        console.error(error),

        res.status(500).json({
            message: "Server error"
        });

    }
};

const getCandidatesByElection = async (req, res) => {
    try{
        const {electionId} = req.params;

        const [candidates] = await db.execute(
            `SELECT
                c.id,
                c.name,
                c.description,
                c.election_id,
                e.title AS election_title
            FROM candidates c
            INNER JOIN elections e
                ON c.election_id = e.id
            WHERE c.election_id = ?
            ORDER BY c.name ASC`,
            [electionId]
        );

        res.status(200).json({
            electionId,
            candidates
        });
    } catch(error){
        console.error(error),
        res.status(500).json({
            message: "Server error"
        });
    }
};

// Update candidate

const updateCandidate = async (req, res) => {
    try{
        const {id} = req.params;

        const {name, description} = req.body;

        if(!name){
            return res.status(400).json({
                message: "Candidate name are required"
            });
        }

        const [result] = await db.execute(
            `UPDATE candidates
            SET name = ?, description = ?
            WHERE id = ?`,
            [
                name,
                description || null,
                id
            ]
        );

        if(result.affectedRows === 0){
            return res.status(404).json({
                message: "Candidate not found"
            });
        }

        res.status(200).json({
            message: "Candidate Update successfully"
        });
    } catch(error){
        console.error(error),
        res.status(500).json({
            message: "Server error"
        });
    }
};

// Delete candidate

const deleteCandidate = async (req, res) => {
    try{
        const {id} = req.params;

        const [result] = await db.execute(
            `DELETE FROM candidates WHERE id = ?`,
            [id]
        );

        if(result.affectedRows === 0){
            return res.status(404).json({
                message: "Candidate not found"
            });
        }


        res.status(200).json({
            message: "Candidate deleted succesfully"
        });
    } catch(error){
        console.error(error),
        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    createCandidate,
    getAllCandidates,
    getCandidatesByElection,
    updateCandidate,
    deleteCandidate
};