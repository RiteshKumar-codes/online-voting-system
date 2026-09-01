const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

// login user

const loginUser = async (req,res) => {
    try{
        const {email,password} = req.body;

        // Validation
        if(!email || !password){
            return res.status(400).json({
                message: "email and password are required"
            });
        }


        // find user
        const sql = `
                SELECT id, name, email, password, role
                FROM users
                WHERE email = ?
                `;

        db.query(sql, [email], async (err, results) => {
            if(err){
                console.error(err);
               return res.status(500).json({
                message: "Database error"
               }); 
            }

            // user not found
            if(results.length === 0){
                return res.status(401).json({
                    message: "Invaild email and password"
                });
            }

            const user = results[0];

            // Compare password
            const isPasswordCorrect = await bcrypt.compare(
                password,
                user.password
            );

            if(!isPasswordCorrect){
                return res.status(401).json({
                    message: "Invaild email and password"
                });
            }

            // Genrate jwt
            const token = jwt.sign(
                {
                    id: user.id,
                    role: user.role
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "1d"
                }
            );

            res.status(200).json({
                message: "Login successfull",
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        });
    } catch(error){
        console.error(error);

        return res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {registerUser, loginUser};