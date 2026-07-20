const asyncHandler = require("express-async-handler");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

// @desc    Get logged-in user's cart
// @route   GET /api/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.product",
    "name image price stock"
  );

  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  res.status(200).json({ success: true, data: cart });
});

// @desc    Add item to cart (or increase quantity if already present)
// @route   POST /api/cart
// @access  Private
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (product.stock < quantity) {
    res.status(400);
    throw new Error("Not enough stock available");
  }

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = new Cart({ user: req.user._id, items: [] });
  }

  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId
  );

  if (existingItem) {
    existingItem.quantity += Number(quantity);
  } else {
    cart.items.push({ product: productId, quantity, price: product.price });
  }

  await cart.save();
  await cart.populate("items.product", "name image price stock");

  res.status(200).json({
    success: true,
    message: "Item added to cart",
    data: cart,
  });
});

// @desc    Update quantity of a cart item
// @route   PUT /api/cart/:id  (id = cart item's _id)
// @access  Private
const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  const item = cart.items.id(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error("Cart item not found");
  }

  if (quantity < 1) {
    res.status(400);
    throw new Error("Quantity must be at least 1");
  }

  item.quantity = quantity;
  await cart.save();
  await cart.populate("items.product", "name image price stock");

  res.status(200).json({
    success: true,
    message: "Cart updated",
    data: cart,
  });
});

// @desc    Remove a single item from cart
// @route   DELETE /api/cart/:id  (id = cart item's _id)
// @access  Private
const removeCartItem = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  cart.items = cart.items.filter(
    (item) => item._id.toString() !== req.params.id
  );

  await cart.save();
  await cart.populate("items.product", "name image price stock");

  res.status(200).json({
    success: true,
    message: "Item removed from cart",
    data: cart,
  });
});

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (cart) {
    cart.items = [];
    await cart.save();
  }

  res.status(200).json({ success: true, message: "Cart cleared", data: cart });
});

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};
