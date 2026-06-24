const authService = require("../services/authService");

/**
 * authController.js
 * --------------------------------------------------
 * Controllers are kept "thin" - they only:
 *   1. Pull data out of the request
 *   2. Call the service layer to do the real work
 *   3. Send back a consistent JSON response
 */

// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Public registration accepts role selection (user or admin).
    const userRole = role === "admin" ? "admin" : "user";
    const result = await authService.registerUser({ name, email, password, role: userRole });

    res.status(201).json({
      success: true,
      message: "Registered successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await authService.loginUser({ email, password });

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/logout
// Since we use stateless JWTs (no server-side session), "logout" simply
// tells the client to delete the token. There is nothing to clear server-side.
const logout = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: "Logged out successfully. Please remove the token on the client.",
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    const user = await authService.getProfile(req.user._id);

    res.status(200).json({
      success: true,
      message: "Current user fetched successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  getMe,
};
