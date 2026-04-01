const express = require("express");
const router = express.Router();
const { signup, login,updateProfile } = require("../controllers/authController");

router.post("/signup", signup);
router.post("/login", login);
router.put("/update-profile", updateProfile);

module.exports = router;
