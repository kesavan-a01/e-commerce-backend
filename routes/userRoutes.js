const express = require("express");
const router = express.Router();
const {
  getUsers,
  deleteUser,
  getDashboardStats,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");

router.use(protect, admin);

router.get("/dashboard-stats", getDashboardStats);
router.get("/", getUsers);
router.delete("/:id", deleteUser);

module.exports = router;
