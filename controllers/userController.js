const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

// @desc    Get all users (admin), with optional search
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const { keyword } = req.query;

  const query = { role: "user" };
  if (keyword) {
    query.$or = [
      { fullName: { $regex: keyword, $options: "i" } },
      { email: { $regex: keyword, $options: "i" } },
    ];
  }

  const users = await User.find(query).sort({ createdAt: -1 });

  res.status(200).json({ success: true, data: users });
});

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.role === "admin") {
    res.status(400);
    throw new Error("Cannot delete an admin account");
  }

  await user.deleteOne();

  res.status(200).json({ success: true, message: "User deleted" });
});

// @desc    Get dashboard statistics for admin
// @route   GET /api/users/dashboard-stats
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
  const [totalUsers, totalProducts, totalOrders, orders, recentOrders, lowStock] =
    await Promise.all([
      User.countDocuments({ role: "user" }),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.find({}, "totalPrice"),
      Order.find()
        .populate("user", "fullName email")
        .sort({ createdAt: -1 })
        .limit(5),
      Product.find({ stock: { $lte: 5 } }).sort({ stock: 1 }).limit(5),
    ]);

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);

  res.status(200).json({
    success: true,
    data: {
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      recentOrders,
      lowStockProducts: lowStock,
    },
  });
});

module.exports = { getUsers, deleteUser, getDashboardStats };
