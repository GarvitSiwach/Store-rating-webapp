const express = require("express");
const router = express.Router();

const storeController = require("../controllers/store.controller");

const { authenticate } = require("../middlewares/auth.middleware");
const { authorizeRoles } = require("../middlewares/role.middleware");

router.get("/", authenticate, storeController.getAllStoresForUser);

router.post(
  "/:storeId/rate",
  authenticate,
  storeController.submitRating
);

router.get(
  "/owner/dashboard",
  authenticate,
  authorizeRoles("STORE_OWNER"),
  storeController.getOwnerDashboard
);

module.exports = router;