const express = require("express");
const router = express.Router();

const { authenticate } = require("../middlewares/auth.middleware");
const { authorizeRoles } = require("../middlewares/role.middleware");


const { getDashboardStats, addStore, addUser, getAllUsers, getAllStores, getSingleUser } = require("../controllers/admin.controller");


router.get(
  "/dashboard",
  authenticate,
  authorizeRoles("ADMIN"),
  getDashboardStats
);

router.post(
    "/stores",
    authenticate,
    authorizeRoles("ADMIN"),
    addStore
  );

router.post(
    "/add-user",
    authenticate,
    authorizeRoles("ADMIN"),
    addUser
);
  
router.get(
    "/users",
    authenticate,
    authorizeRoles("ADMIN"),
    getAllUsers
  );

  router.get(
    "/stores",
    authenticate,
    authorizeRoles("ADMIN"),
    getAllStores
  );
  
  router.get(
    "/users/:id",
    authenticate,
    authorizeRoles("ADMIN"),
    getSingleUser
  );

module.exports = router;

