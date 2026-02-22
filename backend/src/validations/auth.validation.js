const { body } = require("express-validator");

exports.signupValidation = [
  body("name")
    .isLength({ min: 3, max: 60 })
    .withMessage("Name must be between 3 and 60 characters"),

  body("email")
    .isEmail()
    .withMessage("Invalid email format"),

  body("password")
    .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/)
    .withMessage("Password must be 8-16 chars, include 1 uppercase & 1 special char"),

  body("address")
    .isLength({ max: 400 })
    .withMessage("Address max 400 characters"),
];
