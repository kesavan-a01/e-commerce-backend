const asyncHandler = require("express-async-handler");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

// @desc    Place a new order (from current cart)
// @route   POST /api/orders
// @access  Private
const placeOrder = asyncHandler(async (req, res) => {
  const { shippingInfo } = req.body;

  const cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.product"
  );

  if (!cart || cart.items.length === 0) {
    res.status(400);
    throw new Error("Your cart is empty");
  }

  // Verify stock availability and build order items
  const orderItems = [];
  for (const item of cart.items) {
    const product = item.product;
    if (!product) continue;

    if (product.stock < item.quantity) {
      res.status(400);
      throw new Error(`Insufficient stock for ${product.name}`);
    }

    orderItems.push({
      product: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity: item.quantity,
    });
  }

  const totalPrice = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    shippingInfo,
    totalPrice,
  });

  // Decrease stock for each ordered product
  for (const item of orderItems) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity },
    });
  }

  // Clear the cart after order is placed
  cart.items = [];
  await cart.save();

  res.status(201).json({
    success: true,
    message: "Order placed successfully",
    data: order,
  });
});

// @desc    Get logged-in user's order history
// @route   GET /api/orders/my
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({
    createdAt: -1,
  });

  res.status(200).json({ success: true, data: orders });
});

// @desc    Get all orders (admin), with optional search/filter
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = asyncHandler(async (req, res) => {
  const { status, keyword, page = 1, limit = 20 } = req.query;

  const query = {};
  if (status) query.status = status;

  let orders = await Order.find(query)
    .populate("user", "fullName email")
    .sort({ createdAt: -1 });

  if (keyword) {
    const lower = keyword.toLowerCase();
    orders = orders.filter(
      (o) =>
        o._id.toString().includes(lower) ||
        o.user?.fullName?.toLowerCase().includes(lower) ||
        o.user?.email?.toLowerCase().includes(lower)
    );
  }

  const pageNum = Math.max(Number(page), 1);
  const limitNum = Math.max(Number(limit), 1);
  const start = (pageNum - 1) * limitNum;
  const paginated = orders.slice(start, start + limitNum);

  res.status(200).json({
    success: true,
    data: paginated,
    pagination: {
      total: orders.length,
      page: pageNum,
      pages: Math.ceil(orders.length / limitNum),
    },
  });
});

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const validStatuses = [
    "Pending",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error("Invalid order status");
  }

  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  order.status = status;
  await order.save();

  res.status(200).json({
    success: true,
    message: "Order status updated",
    data: order,
  });
});

// @desc    Delete an order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  await order.deleteOne();

  res.status(200).json({ success: true, message: "Order deleted" });
});

module.exports = {
  placeOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
};
