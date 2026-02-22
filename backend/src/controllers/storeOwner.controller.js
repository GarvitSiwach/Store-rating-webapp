const db = require("../config/db");

// Get all stores of logged-in owner
exports.getOwnerStores = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const [stores] = await db.query(
      `SELECT 
        s.id AS store_id,
        s.name AS store_name,
        COUNT(r.id) AS total_ratings,
        AVG(r.rating) AS average_rating
       FROM stores s
       LEFT JOIN ratings r ON s.id = r.store_id
       WHERE s.owner_id = ?
       GROUP BY s.id`,
      [ownerId]
    );

    res.json(stores);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch owner stores",
    });
  }
};

// Get ratings of a specific store (only if owner owns it)
exports.getStoreRatings = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { storeId } = req.params;

    // Check ownership
    const [store] = await db.query(
      "SELECT id FROM stores WHERE id = ? AND owner_id = ?",
      [storeId, ownerId]
    );

    if (store.length === 0) {
      return res.status(403).json({
        message: "Unauthorized access",
      });
    }

    const [ratings] = await db.query(
      `SELECT 
        u.name,
        u.email,
        r.rating,
        r.created_at
       FROM ratings r
       JOIN users u ON r.user_id = u.id
       WHERE r.store_id = ?`,
      [storeId]
    );

    res.json(ratings);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch ratings",
    });
  }
};