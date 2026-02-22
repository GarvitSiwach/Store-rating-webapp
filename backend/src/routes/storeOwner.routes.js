const express = require("express");
const router = express.Router();

const {
  getOwnerStores,
  getStoreRatings,
} = require("../controllers/storeOwner.controller");

const { authenticate } = require("../middlewares/auth.middleware");
const { authorizeRoles } = require("../middlewares/role.middleware");

// Protect all owner routes
router.use(authenticate);
router.use(authorizeRoles("STORE_OWNER"));

// Get all stores of owner
router.get("/stores", getOwnerStores);

// Get ratings for specific store
router.get("/stores/:storeId/ratings", getStoreRatings);

module.exports = router;