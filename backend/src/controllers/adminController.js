const authService = require("../services/authService");

/**
 * adminController.js
 * --------------------------------------------------
 * Admin-only controller for user account creation.
 */
const createAdminUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const result = await authService.registerUser({
      name,
      email,
      password,
      role: role === "admin" ? "admin" : "user",
    });

    res.status(201).json({
      success: true,
      message: "Admin user created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAdminUser,
};
