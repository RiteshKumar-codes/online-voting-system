const db = require("../config/db");

const createElection  = (req, res) => {
    const {
        title,
        description,
        start_date,
        end_date
    } = req.body;

   if(!title || !start_date || !end_date){
        return res.status(400).json({
            message: "Title, start date and end date are required"
        });
    }

    if(new Date(start_date) >= new Date(end_date)){
       return res.status(400).json({
        message: "End date must be after start date"
       });
    }

    const sql = `
    INSERT INTO elections
    (title, description, start_date, end_date, status)
    VALUES (?, ?, ?, ?, 'upcoming')
    `;

    db.query(
        sql,
        [title, description || null, start_date, end_date],
        (err, result) => {
            if(err){
                console.error(err);
                return res.status(500).json({
                    message: "Failed to create election"
                });
            }

            res.status(201).json({
                message: "Election created successfully",
                electionId: result.insertId
            });
        }
    );
};

const getAllElections = (req, res) => {
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
    ORDER BY created_at DESC
    `;

    db.query(sql, (err, result) => {
       if(err){
        console.error(err);

        return res.status(500).json({
            message: "Failed to fetch elections"
        });
       }

       res.status(200).json({
        elections: result
       });
    });
};

const getElectionById = (req, res) => {
    const {id} = req.params;

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

    db.query(sql, [id], (err, results) => {
        if(err){
            console.error(err);
            return res.status(500).json({
                message: "Failed to fetch election"
            });
        }

        if(results.length === 0){
           return res.status(404).json({
            message: "Election not found"
           });
        }

        res.status(200).json({
            election: results[0]
        });
    });
};

const updateElection = (req, res) => {
    const {id} = req.params;

    const {
        title,
        description,
        start_date,
        end_date,
        status
    } = req.body;

    if(!title || !start_date || !end_date || !status){
        return res.status(400).json({
            message: "Title, dates and status are required"
        });
    }


    if(new Date(start_date) >= new Date(end_date)){
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

    db.query(
        sql,
        [
            title,
            description || null,
            start_date,
            end_date,
            status,
            id
        ],
        (err, result) => {
            if(err){
                return res.status(500).json({
                    message: "Failed to update election"
                });
            }

            if(result.affectedRows === 0){
                return res.status(404).json({
                    message: "Election not found"
                });
            }

            res.status(200).json({
                message: "Election updated successfully"
            });
        }
    );
    
};

const deleteElection = (req, res) => {
    const {id} = req.params;

    const sql = `
    DELETE FROM elections
    WHERE id = ?
    `;


    db.query(sql, [id], (err, result) => {
        if(err){
            console.error(err);
            return res.status(500).json({
                message: "Failed to delete election"
            });
        }

        if(result.affectedRows === 0){
            return res.status(404).json({
                message: "Election not found"
            });
        }

        res.status(200).json({
            message: "Election deleted successfully"
        });
    });
};

module.exports = {
    createElection,
    getAllElections,
    getElectionById,
    updateElection,
    deleteElection
};