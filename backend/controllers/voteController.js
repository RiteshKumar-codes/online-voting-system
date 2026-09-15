const { Connection } = require("mysql2/promise");
const db = require("../config/db");

// Cast vote
const castVote = async (req, res) => {

    const connection = await db.getConnection();

    try{
        const user_id = req.user.id;

        const {election_id, candidate_id} = req.body;

        //Validate input
        if(!election_id || !candidate_id){
            return res.status(400).json({
                message: "Election ID and Candidate ID are reqired"
            });
        }

        await connection.beginTransaction();

        //check whether election exists
        const [elections] = await connection.execute(
            `SELECT id, status, start_date, end_date
            FROM elections
            WHERE id = ?
            FOR UPDATE`,
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

            await connection.rollback(); 

            return res.status(400).json({
                message: "Voting is not currently active for this election"
            });
        }

        //check election date

        const currentTime = new Date();

        const startDate = new Date(election.start_date);
        const endDate = new Date(election.end_date);

        if(currentTime < startDate){
            await connection.rollback();
            return res.status(400).json({
                message: "Voting has not started yet"
            });
        }

        if(currentTime > endDate){
            await connection.rollback();

            return res.status(400).json({
                message: "Voting has ended"
            });
        }

        //check whether candidate exists
        const [candidates] = await connection.execute(
            `SELECT id, election_id
            FROM candidates
            WHERE id = ?`,
            [candidate_id]
        );

        if(candidates.length === 0){

            await connection.rollback();
            return res.status(404).json({
                message: "Candidate not found"
            });
        }

        const candidate = candidates[0];

        //Make sure candidate belongs to this election
        if( Number(candidates[0].election_id) !==
            Number(election_id)){

                await connection.rollback();

            return res.status(400).json({
                message: "Candidate does not belong to this election"
            });
        }

        //check whether user already voted
        const [existingVote] = await connection.execute(
            `SELECT id
            FROM votes
            WHERE user_id = ?
            AND election_id = ?
            FOR UPDATE`,
            [user_id,election_id]
        );

        if(existingVote.length>0){

            await connection.rollback();
            return res.status(409).json({
                message: "You have already voted in this election"
            });
        }

        //Insert vote
        const [result] = await connection.execute(
            `INSERT INTO votes
            (user_id, election_id, candidate_id)
            VALUES (?, ?, ?)`,
            [user_id, election_id, candidate_id]
        );

        await connection.commit();

        res.status(201).json({
            message: "Vote cast successfully",
            voteId: result.insertId
        });
    } catch(error){

        await connection.rollback();
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
    finally{
        // Release connection back to pool
        connection.release();
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