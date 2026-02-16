const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");
const { body } = require("express-validator");

const router = express.Router();


//    REGISTER


router.post(
  "/register",
  [
    body("firstName").notEmpty().withMessage("First name required"),
    body("lastName").notEmpty().withMessage("Last name required"),
    body("email").isEmail().withMessage("Valid email required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be 6 chars"),
    body("country").notEmpty().withMessage("Country required"),
  ],
  registerUser
);


//    LOGIN


router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("password").notEmpty().withMessage("Password required"),
  ],
  loginUser
);

module.exports = router;
