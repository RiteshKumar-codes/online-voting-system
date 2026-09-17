const db = require("../config/db");

// get Election results

const getElectionResults = async (req, res) => {
    try {
        const { electionId } = req.params;

        //check election exists

        const [elections] = await db.execute(
            `SELECT
            id,
            title,
            description,
            start_date,
            end_date,
            status
            FROM elections
            WHERE id = ?`,
            [electionId]
        );

        if (elections.length === 0) {
            return res.status(404).json({
                message: "Election not found"
            });
        }

        const election = elections[0];

        // get candidate-wise results

        const [results] = await db.execute(
            `
    SELECT
        c.id AS candidate_id,
        c.name AS candidate_name,
        c.description,
        COUNT(v.id) AS vote_count
    FROM candidates c
    LEFT JOIN votes v
        ON c.id = v.candidate_id
    WHERE c.election_id = ?
    GROUP BY
        c.id,
        c.name,
        c.description
    ORDER BY vote_count DESC
    `,
            [electionId]
        );

        // Get total votes
        const [total] = await db.execute(
            `SELECT COUNT(*) AS total_votes
            FROM votes
            WHERE election_id = ?`,
            [electionId]
        );

        let winner = null;

        if (results.length > 0) {

            const highestVotes = Number(results[0].vote_count);

            const topCandidates = results.filter(
                candidate =>
                    Number(candidate.vote_count) === highestVotes
            );

            if (topCandidates.length === 1) {
                winner = topCandidates[0];
            }
        }

        res.status(200).json({
            election: {
                id: election.id,
                title: election.title,
                description: election.description,
                start_date: election.start_date,
                end_date: election.end_date,
                status: election.status
            },
            totalVotes: total[0].total_votes,
            winner,
            results
        });
    } catch (error) {
        console.error("Get election result error", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = { getElectionResults };