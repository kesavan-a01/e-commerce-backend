const express = require("express");
const router = express.Router();
const {
  placeOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/orderController");
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");

router.use(protect);

router.post("/", placeOrder);
router.get("/my", getMyOrders);
router.get("/", admin, getAllOrders);
router.put("/:id", admin, updateOrderStatus);
router.delete("/:id", admin, deleteOrder);

module.exports = router;
