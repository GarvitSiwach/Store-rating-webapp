const express = require("express");
const router = express.Router();

const { signup, login } = require("../controllers/auth.controller");
const { signupValidation } = require("../validations/auth.validation");
const { authenticate } = require("../middlewares/auth.middleware");
const authController = require("../controllers/auth.controller");

router.post("/signup", signupValidation, signup);
router.post("/login", login);
router.put(
    "/update-password",
    authenticate,
    authController.updatePassword
  );

module.exports = router;
