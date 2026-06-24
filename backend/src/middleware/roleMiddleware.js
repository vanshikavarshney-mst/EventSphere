/**
 * roleMiddleware.js
 * --------------------------------------------------
 * Restricts a route to only the given role(s).
 * Must be used AFTER authMiddleware so that req.user is already set.
 *
 * Usage:
 *   router.post("/", authenticateUser, authorizeRoles("admin"), createEvent);
 */
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Requires role: ${allowedRoles.join(" or ")}`,
      });
    }
    next();
  };
};

module.exports = authorizeRoles;
