// Restricts route access to users with role "admin".
// Must be used AFTER the `protect` middleware, since it relies on req.user.
const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  res.status(403);
  throw new Error("Access denied. Admin privileges required.");
};

module.exports = { admin };
