const pool = require("../config/db");
const db = require("../config/db");

exports.getDashboardStats = async (req, res, next) => {
  try {
    const [[usersCount]] = await pool.query(
      "SELECT COUNT(*) as total_users FROM users"
    );

    const [[storesCount]] = await pool.query(
      "SELECT COUNT(*) as total_stores FROM stores"
    );

    const [[ratingsCount]] = await pool.query(
      "SELECT COUNT(*) as total_ratings FROM ratings"
    );

    res.json({
      totalUsers: usersCount.total_users,
      totalStores: storesCount.total_stores,
      totalRatings: ratingsCount.total_ratings,
    });

  } catch (error) {
    next(error);
  }
};

exports.addStore = async (req, res, next) => {
  try {
    const { name, email, address, owner_id } = req.body;

    if (!name || !email || !address) {
      return res.status(400).json({
        message: "Name, email and address are required",
      });
    }

    // ✅ If owner_id provided, validate it
    if (owner_id) {
      const [owner] = await pool.query(
        "SELECT id, role FROM users WHERE id = ?",
        [owner_id]
      );

      if (owner.length === 0) {
        return res.status(400).json({
          message: "Owner not found",
        });
      }

      if (owner[0].role !== "STORE_OWNER") {
        return res.status(400).json({
          message: "Selected user is not a STORE_OWNER",
        });
      }
    }

    const [result] = await pool.query(
      `INSERT INTO stores (name, email, address, owner_id)
       VALUES (?, ?, ?, ?)`,
      [name, email, address, owner_id || null]
    );

    res.status(201).json({
      message: "Store added successfully",
      storeId: result.insertId,
    });

  } catch (error) {
    next(error);
  }
};
  
  const bcrypt = require("bcrypt");

  exports.addUser = async (req, res, next) => {
    try {
      const { name, email, password, address, role } = req.body;
  
      if (!name || !email || !password || !address || !role) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      if (!["ADMIN", "USER", "STORE_OWNER"].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }
  
      const [existingUser] = await pool.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
      );
  
      if (existingUser.length > 0) {
        return res.status(400).json({ message: "Email already registered" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const [result] = await pool.query(
        "INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)",
        [name, email, hashedPassword, address, role]
      );
  
      res.status(201).json({
        message: "User created successfully",
        userId: result.insertId
      });
  
    } catch (error) {
        next(error);
      }
  };
  
  exports.getAllUsers = async (req, res, next) => {
    try {
      let { name, email, address, role, sortBy = "id", order = "ASC" } = req.query;
  
      let query = "SELECT id, name, email, address, role FROM users WHERE 1=1";
      let values = [];
  
      if (name) {
        query += " AND name LIKE ?";
        values.push(`%${name}%`);
      }
  
      if (email) {
        query += " AND email LIKE ?";
        values.push(`%${email}%`);
      }
  
      if (address) {
        query += " AND address LIKE ?";
        values.push(`%${address}%`);
      }
  
      if (role) {
        query += " AND role = ?";
        values.push(role);
      }
  
      const allowedSortFields = ["id", "name", "email", "role"];
      if (!allowedSortFields.includes(sortBy)) {
        sortBy = "id";
      }
  
      order = order.toUpperCase() === "DESC" ? "DESC" : "ASC";
  
      query += ` ORDER BY ${sortBy} ${order}`;
  
      const [users] = await pool.query(query, values);
  
      res.json(users);
  
    } catch (error) {
        next(error);
      }
  };

  exports.getAllStores = async (req, res, next) => {
    try {
      const [stores] = await db.execute(`
        SELECT 
          s.id,
          s.name,
          s.email,
          s.address,
          u.name AS owner_name,
          IFNULL(ROUND(AVG(r.rating), 1), 0) AS average_rating,
          COUNT(r.id) AS total_ratings
        FROM stores s
        LEFT JOIN users u ON s.owner_id = u.id
        LEFT JOIN ratings r ON s.id = r.store_id
        GROUP BY s.id
        ORDER BY s.created_at DESC
      `);
  
      res.json({
        success: true,
        data: stores
      });
    } catch (error) {
        next(error);
      }
  };

  exports.getSingleUser = async (req, res, next) => {
    try {
      const { id } = req.params;
  
      const [users] = await db.execute(
        `
        SELECT 
          u.id,
          u.name,
          u.email,
          u.address,
          u.role,
          u.created_at,
          COUNT(r.id) AS total_ratings_given
        FROM users u
        LEFT JOIN ratings r ON u.id = r.user_id
        WHERE u.id = ?
        GROUP BY u.id
        `,
        [id]
      );
  
      if (users.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }
  
      res.json({
        success: true,
        data: users[0]
      });
  
    } catch (error) {
        next(error);
      }
  };