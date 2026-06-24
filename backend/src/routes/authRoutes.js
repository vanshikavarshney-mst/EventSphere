const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const authenticateUser = require("../middleware/authMiddleware");
const { registerRules, loginRules, validate } = require("../validators/authValidator");

router.post("/register", registerRules, validate, authController.register);
router.post("/login", loginRules, validate, authController.login);
router.post("/logout", authenticateUser, authController.logout);
router.get("/me", authenticateUser, authController.getMe);

module.exports = router;
