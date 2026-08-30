const db = require("../config/db");
const bcrypt = require("bcryptjs");

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Vallidation
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }

        // Check if email already exists

        const checkUserSql = "SELECT * FROM users WHERE email = ?";

        db.query(checkUserSql, [email], async (err, result) => {
            if (err) {
                console.log(err);

                return res.status(500).json({
                    message: "Database error"
                });
            }

            if (result.length > 0) {
                return res.status(409).json({
                    message: "Email already register"
                });
            }

            // hash password

            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert user

            const insertUserSql = `
            INSERT INTO users (name, email, password) 
            VALUES (?, ?, ?) `;

            db.query(insertUserSql,
                [name, email, hashedPassword],
                (err, result) => {
                    if (err) {
                        console.error(err);

                        return res.status(500).json({
                            message: "Failed to register user"
                        });
                    }

                    return res.status(201).json({
                       message: "User registered successfully",
                       userId: result.insertId
                    });

                }

            )
        });

    } catch(error){
        console.error(error);
        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {registerUser};