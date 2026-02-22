const db = require("../config/db");

exports.getAllStoresForUser = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { search = "", sortBy = "created_at", order = "DESC" } = req.query;
  
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5;
      const offset = (page - 1) * limit;
  
      const allowedSortFields = ["name", "average_rating", "created_at"];
      const sortField = allowedSortFields.includes(sortBy)
        ? sortBy
        : "created_at";
  
      const sortOrder = order.toUpperCase() === "ASC" ? "ASC" : "DESC";
  
      const [stores] = await db.execute(
        `
        SELECT 
          s.id,
          s.name,
          s.email,
          s.address,
          IFNULL(ROUND(AVG(r.rating),1),0) AS average_rating,
          COUNT(r.id) AS total_ratings,
          ur.rating AS user_rating,
          s.created_at
        FROM stores s
        LEFT JOIN ratings r ON s.id = r.store_id
        LEFT JOIN ratings ur 
          ON s.id = ur.store_id AND ur.user_id = ?
        WHERE s.name LIKE ?
        GROUP BY s.id, s.name, s.email, s.address, ur.rating, s.created_at
        ORDER BY ${sortField} ${sortOrder}
        LIMIT ${limit} OFFSET ${offset}
        `,
        [userId, `%${search}%`]
      );
  
      res.json({
        success: true,
        page,
        limit,
        data: stores
      });
  
    } catch (error) {
      next(error);
    }
  };

  exports.submitRating = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { storeId } = req.params;
  
      if (!req.body || req.body.rating === undefined) {
        return res.status(400).json({
          success: false,
          message: "Rating is required"
        });
      }
  
      const numericRating = parseInt(req.body.rating);
  
      if (!numericRating || numericRating < 1 || numericRating > 5) {
        return res.status(400).json({
          success: false,
          message: "Rating must be between 1 and 5"
        });
      }
  
      // Check store exists
      const [store] = await db.execute(
        "SELECT id FROM stores WHERE id = ?",
        [storeId]
      );
  
      if (store.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Store not found"
        });
      }
  
      // Check if rating already exists
      const [existing] = await db.execute(
        "SELECT id FROM ratings WHERE user_id = ? AND store_id = ?",
        [userId, storeId]
      );
  
      if (existing.length > 0) {
        // UPDATE
        await db.execute(
          `
          UPDATE ratings
          SET rating = ?
          WHERE user_id = ? AND store_id = ?
          `,
          [numericRating, userId, storeId]
        );
  
        return res.json({
          success: true,
          message: "Rating updated successfully"
        });
      }
  
      // INSERT
      await db.execute(
        `
        INSERT INTO ratings (user_id, store_id, rating)
        VALUES (?, ?, ?)
        `,
        [userId, storeId, numericRating]
      );
  
      res.status(201).json({
        success: true,
        message: "Rating submitted successfully"
      });
  
    } catch (error) {
        next(error);
      }
  };

  exports.getOwnerDashboard = async (req, res, next) => {
    try {
      const ownerId = req.user.id;
  
      // First get owner stores
      const [stores] = await db.execute(
        "SELECT id, name FROM stores WHERE owner_id = ?",
        [ownerId]
      );
  
      if (stores.length === 0) {
        return res.json({
          success: true,
          message: "No store assigned to you",
          data: []
        });
      }
  
      const dashboardData = [];
  
      for (let store of stores) {
        const [ratings] = await db.execute(
          `
          SELECT 
            u.name AS user_name,
            r.rating,
            r.created_at
          FROM ratings r
          JOIN users u ON r.user_id = u.id
          WHERE r.store_id = ?
          ORDER BY r.created_at DESC
          `,
          [store.id]
        );
  
        const [summary] = await db.execute(
          `
          SELECT 
            IFNULL(ROUND(AVG(rating),1),0) AS average_rating,
            COUNT(id) AS total_ratings
          FROM ratings
          WHERE store_id = ?
          `,
          [store.id]
        );
  
        dashboardData.push({
          store_id: store.id,
          store_name: store.name,
          average_rating: summary[0].average_rating,
          total_ratings: summary[0].total_ratings,
          ratings
        });
      }
  
      res.json({
        success: true,
        data: dashboardData
      });
  
    } catch (error) {
        next(error);
      }
  };