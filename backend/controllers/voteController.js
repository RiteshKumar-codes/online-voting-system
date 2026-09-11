const db = require("../config/db");

// Cast vote
const castVote = async (req, res) => {
    try{
        const user_id = req.user.id;

        const {election_id, candidate_id} = req.body;

        //Validate input
        if(!election_id || !candidate_id){
            return res.status(400).json({
                message: "Election ID and Candidate ID are reqired"
            });
        }

        //check whether election exists
        const [elections] = await db.execute(
            `SELECT id, status, start_date, end_date
            FROM elections
            WHERE id = ?`,
            [election_id]
        );

        if(elections.length === 0){
            return res.status(404).json({
                message: "Election not found"
            });
        }

        const election = elections[0];

        //check election status
        if(election.status !== "active"){
            return res.status(400).json({
                message: "Voting is not currently active for this election"
            });
        }

        //check whether candidate exists
        const [candidates] = await db.execute(
            `SELECT id, election_id
            FROM candidates
            WHERE id = ?`,
            [candidate_id]
        );

        if(candidates.length === 0){
            return res.status(404).json({
                message: "Candidate not found"
            });
        }

        const candidate = candidates[0];

        //Make sure candidate belongs to this election
        if(candidate.election_id != election_id){
            return res.status(400).json({
                message: "Candidate does not belong to this election"
            });
        }

        //check whether user already voted
        const [existingVote] = await db.execute(
            `SELECT id
            FROM votes
            WHERE user_id = ?
            AND election_id = ?`,
            [user_id,election_id]
        );

        if(existingVote.length>0){
            return res.status(409).json({
                message: "You have already voted in this election"
            });
        }

        //Insert vote
        const [result] = await db.execute(
            `INSERT INTO votes
            (user_id, election_id, candidate_id)
            VALUES (?, ?, ?)`,
            [user_id, election_id, candidate_id]
        );

        res.status(201).json({
            message: "Vote cast successfully",
            voteId: result.insertId
        });
    } catch(error){
        console.error("Cast vote error:",error);

        //Handle duplicate vote at database level
        if(error.code === "ER_DUP_ENTRY"){
          return res.status(409).json({
            message: "You have already voted in this election"
          });
        }

        res.status(500).json({
            message: "Server error"
        });
    }
};

// Get loged-in user's voting history
const getMyVotes = async (req, res) => {
    try{
        const user_id = req.user.id;

        const [votes] = await db.execute(
            `SELECT 
            v.id,
            v.election_id,
            e.title AS election_title,
            v.candidate_id,
            c.name AS candidate_name,
            v.created_at
            FROM votes v
            INNER JOIN elections e
               ON v.election_id = e.id
            INNER JOIN candidates c
               ON v.candidate_id = c.id
                WHERE v.user_id = ?
                ORDER BY v.created_at DESC`,
                [user_id]
        );
        
        res.status(200).json({
            votes
        });
    }catch(error){
        console.error("Get votes error",error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {castVote, getMyVotes};