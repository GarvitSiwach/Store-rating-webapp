const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const db = require("../config/db");

exports.signup = async (req, res, next) => {
  try {

    console.log("Signup route hit");

    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, address } = req.body;

    // Check if email exists
    const [existingUser] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      "INSERT INTO users (name, email, password, address) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, address]
    );

    res.status(201).json({
      message: "User registered successfully",
      userId: result.insertId,
    });

  } catch (error) {
    next(error);
  }
};


exports.login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
  
      const [users] = await pool.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
      );
  
      if (users.length === 0) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
  
      const user = users[0];
  
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
  
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );
  
      res.json({
        message: "Login successful",
        token,
        role: user.role,
      });
  
    } catch (error) {
        next(error);
      }
  };
  exports.updatePassword = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { currentPassword, newPassword } = req.body;
  
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: "Current and new password are required"
        });
      }
  
      // Get user
      const [users] = await db.execute(
        "SELECT password FROM users WHERE id = ?",
        [userId]
      );
  
      if (users.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }
  
      const user = users[0];
  
      // Compare current password
      const isMatch = await bcrypt.compare(
        currentPassword,
        user.password
      );
  
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Current password is incorrect"
        });
      }
  
      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      await db.execute(
        "UPDATE users SET password = ? WHERE id = ?",
        [hashedPassword, userId]
      );
  
      res.json({
        success: true,
        message: "Password updated successfully"
      });
  
    } catch (error) {
        next(error);
      }
  };