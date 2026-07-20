require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const Order = require("../models/Order");

const categories = ["Electronics", "Fashion", "Home & Kitchen", "Books", "Sports"];

const sampleProducts = [
  // ---------------- Electronics (25) ----------------
  { name: "Wireless Bluetooth Headphones", category: "Electronics", price: 2499, stock: 35, rating: 4.3 },
  { name: "Smart Fitness Watch", category: "Electronics", price: 3999, stock: 20, rating: 4.1 },
  { name: "Portable Power Bank 20000mAh", category: "Electronics", price: 1499, stock: 50, rating: 4.5 },
  { name: "USB-C Fast Charger 65W", category: "Electronics", price: 799, stock: 60, rating: 4.0 },
  { name: "Mechanical Gaming Keyboard", category: "Electronics", price: 3299, stock: 15, rating: 4.6 },
  { name: "Wireless Mouse Ergonomic", category: "Electronics", price: 899, stock: 45, rating: 4.2 },
  { name: "Bluetooth Portable Speaker", category: "Electronics", price: 1899, stock: 30, rating: 4.4 },
  { name: "Noise Cancelling Earbuds", category: "Electronics", price: 3499, stock: 25, rating: 4.5 },
  { name: "27-inch Full HD Monitor", category: "Electronics", price: 12999, stock: 10, rating: 4.3 },
  { name: "1TB External Hard Drive", category: "Electronics", price: 4299, stock: 22, rating: 4.4 },
  { name: "Smartphone Tripod Stand", category: "Electronics", price: 599, stock: 55, rating: 4.0 },
  { name: "Webcam 1080p with Mic", category: "Electronics", price: 2199, stock: 18, rating: 4.1 },
  { name: "Smart LED TV 43-inch", category: "Electronics", price: 21999, stock: 8, rating: 4.5 },
  { name: "Wireless Charging Pad", category: "Electronics", price: 999, stock: 40, rating: 4.0 },
  { name: "Gaming Mousepad XL", category: "Electronics", price: 499, stock: 65, rating: 4.2 },
  { name: "Action Camera 4K", category: "Electronics", price: 8999, stock: 12, rating: 4.4 },
  { name: "Smart Home Wi-Fi Plug", category: "Electronics", price: 699, stock: 50, rating: 4.1 },
  { name: "Portable Bluetooth Projector", category: "Electronics", price: 6499, stock: 9, rating: 4.2 },
  { name: "USB Hub 4-Port 3.0", category: "Electronics", price: 599, stock: 48, rating: 4.0 },
  { name: "Laptop Cooling Pad", category: "Electronics", price: 1299, stock: 27, rating: 4.1 },
  { name: "Smart Digital Alarm Clock", category: "Electronics", price: 799, stock: 33, rating: 4.0 },
  { name: "Car Bluetooth FM Transmitter", category: "Electronics", price: 899, stock: 38, rating: 4.1 },
  { name: "Wireless Earbuds Sports Edition", category: "Electronics", price: 1999, stock: 29, rating: 4.3 },
  { name: "Graphic Tablet for Drawing", category: "Electronics", price: 5499, stock: 11, rating: 4.4 },
  { name: "Smart Video Doorbell", category: "Electronics", price: 3999, stock: 14, rating: 4.2 },

  // ---------------- Fashion (25) ----------------
  { name: "Men's Cotton Casual Shirt", category: "Fashion", price: 899, stock: 40, rating: 4.0 },
  { name: "Women's Running Shoes", category: "Fashion", price: 2199, stock: 25, rating: 4.4 },
  { name: "Denim Jacket", category: "Fashion", price: 1799, stock: 18, rating: 3.9 },
  { name: "Leather Wallet", category: "Fashion", price: 649, stock: 45, rating: 4.2 },
  { name: "Sunglasses UV Protection", category: "Fashion", price: 599, stock: 30, rating: 4.1 },
  { name: "Men's Slim Fit Jeans", category: "Fashion", price: 1499, stock: 35, rating: 4.1 },
  { name: "Women's Floral Summer Dress", category: "Fashion", price: 1699, stock: 22, rating: 4.3 },
  { name: "Unisex Hooded Sweatshirt", category: "Fashion", price: 1299, stock: 40, rating: 4.2 },
  { name: "Formal Leather Belt", category: "Fashion", price: 549, stock: 50, rating: 4.0 },
  { name: "Women's Handbag Tote", category: "Fashion", price: 2299, stock: 20, rating: 4.4 },
  { name: "Men's Formal Blazer", category: "Fashion", price: 3499, stock: 12, rating: 4.3 },
  { name: "Canvas Sneakers Unisex", category: "Fashion", price: 1399, stock: 33, rating: 4.1 },
  { name: "Women's Ethnic Kurti", category: "Fashion", price: 999, stock: 38, rating: 4.2 },
  { name: "Men's Polo T-Shirt", category: "Fashion", price: 799, stock: 55, rating: 4.0 },
  { name: "Wrist Watch Analog", category: "Fashion", price: 1899, stock: 24, rating: 4.3 },
  { name: "Women's Flat Sandals", category: "Fashion", price: 899, stock: 30, rating: 4.0 },
  { name: "Woolen Winter Scarf", category: "Fashion", price: 499, stock: 42, rating: 4.1 },
  { name: "Men's Formal Oxford Shoes", category: "Fashion", price: 2599, stock: 16, rating: 4.4 },
  { name: "Women's Yoga Leggings", category: "Fashion", price: 899, stock: 45, rating: 4.2 },
  { name: "Baseball Cap Adjustable", category: "Fashion", price: 399, stock: 60, rating: 3.9 },
  { name: "Men's Rain Jacket", category: "Fashion", price: 1999, stock: 19, rating: 4.2 },
  { name: "Women's Clutch Purse", category: "Fashion", price: 799, stock: 28, rating: 4.1 },
  { name: "Kids' Casual T-Shirt Pack", category: "Fashion", price: 699, stock: 50, rating: 4.0 },
  { name: "Men's Formal Tie Set", category: "Fashion", price: 599, stock: 35, rating: 4.0 },
  { name: "Women's Denim Skirt", category: "Fashion", price: 1199, stock: 26, rating: 4.1 },

  // ---------------- Home & Kitchen (25) ----------------
  { name: "Non-Stick Frying Pan", category: "Home & Kitchen", price: 999, stock: 22, rating: 4.3 },
  { name: "Electric Kettle 1.5L", category: "Home & Kitchen", price: 1199, stock: 28, rating: 4.2 },
  { name: "Memory Foam Pillow", category: "Home & Kitchen", price: 799, stock: 33, rating: 4.4 },
  { name: "Ceramic Dinner Set (12pc)", category: "Home & Kitchen", price: 2499, stock: 12, rating: 4.5 },
  { name: "LED Desk Lamp", category: "Home & Kitchen", price: 899, stock: 26, rating: 4.0 },
  { name: "Stainless Steel Cookware Set", category: "Home & Kitchen", price: 3999, stock: 14, rating: 4.4 },
  { name: "Cotton Bedsheet Set (King)", category: "Home & Kitchen", price: 1499, stock: 30, rating: 4.2 },
  { name: "Air Fryer 4L", category: "Home & Kitchen", price: 5499, stock: 10, rating: 4.6 },
  { name: "Wooden Chopping Board", category: "Home & Kitchen", price: 499, stock: 48, rating: 4.1 },
  { name: "Wall Clock Modern Design", category: "Home & Kitchen", price: 799, stock: 35, rating: 4.0 },
  { name: "Storage Organizer Box Set", category: "Home & Kitchen", price: 999, stock: 40, rating: 4.2 },
  { name: "Mixer Grinder 750W", category: "Home & Kitchen", price: 2999, stock: 16, rating: 4.3 },
  { name: "Bath Towel Set (4pc)", category: "Home & Kitchen", price: 899, stock: 38, rating: 4.1 },
  { name: "Table Lamp with USB Port", category: "Home & Kitchen", price: 1099, stock: 24, rating: 4.2 },
  { name: "Vacuum Flask 1L", category: "Home & Kitchen", price: 649, stock: 45, rating: 4.0 },
  { name: "Curtains Blackout (Pair)", category: "Home & Kitchen", price: 1299, stock: 20, rating: 4.1 },
  { name: "Non-Stick Cookware Griddle", category: "Home & Kitchen", price: 1199, stock: 18, rating: 4.2 },
  { name: "Induction Cooktop", category: "Home & Kitchen", price: 2199, stock: 15, rating: 4.3 },
  { name: "Water Purifier Jug", category: "Home & Kitchen", price: 899, stock: 27, rating: 4.0 },
  { name: "Decorative Wall Art Set", category: "Home & Kitchen", price: 1599, stock: 22, rating: 4.2 },
  { name: "Kitchen Knife Set", category: "Home & Kitchen", price: 1399, stock: 25, rating: 4.3 },
  { name: "Laundry Basket Foldable", category: "Home & Kitchen", price: 599, stock: 42, rating: 4.0 },
  { name: "Aroma Diffuser Humidifier", category: "Home & Kitchen", price: 1499, stock: 19, rating: 4.3 },
  { name: "Door Mat Anti-Slip", category: "Home & Kitchen", price: 399, stock: 55, rating: 3.9 },
  { name: "Glass Food Storage Containers", category: "Home & Kitchen", price: 899, stock: 33, rating: 4.2 },

  // ---------------- Books (25) ----------------
  { name: "The Pragmatic Programmer", category: "Books", price: 899, stock: 14, rating: 4.7 },
  { name: "Atomic Habits", category: "Books", price: 499, stock: 50, rating: 4.8 },
  { name: "Clean Code", category: "Books", price: 1099, stock: 10, rating: 4.6 },
  { name: "Rich Dad Poor Dad", category: "Books", price: 399, stock: 45, rating: 4.5 },
  { name: "The Alchemist", category: "Books", price: 349, stock: 55, rating: 4.6 },
  { name: "Think and Grow Rich", category: "Books", price: 299, stock: 48, rating: 4.4 },
  { name: "Sapiens: A Brief History of Humankind", category: "Books", price: 599, stock: 30, rating: 4.7 },
  { name: "Deep Work", category: "Books", price: 449, stock: 35, rating: 4.5 },
  { name: "The Lean Startup", category: "Books", price: 549, stock: 25, rating: 4.4 },
  { name: "Introduction to Algorithms", category: "Books", price: 1999, stock: 8, rating: 4.6 },
  { name: "You Don't Know JS Yet", category: "Books", price: 799, stock: 20, rating: 4.5 },
  { name: "Design Patterns Explained", category: "Books", price: 899, stock: 15, rating: 4.3 },
  { name: "The Power of Habit", category: "Books", price: 399, stock: 40, rating: 4.4 },
  { name: "Zero to One", category: "Books", price: 449, stock: 32, rating: 4.5 },
  { name: "The Psychology of Money", category: "Books", price: 399, stock: 46, rating: 4.7 },
  { name: "Ikigai", category: "Books", price: 349, stock: 50, rating: 4.5 },
  { name: "Wings of Fire (Autobiography)", category: "Books", price: 299, stock: 42, rating: 4.6 },
  { name: "Harry Potter Boxed Set", category: "Books", price: 2999, stock: 12, rating: 4.9 },
  { name: "The 7 Habits of Highly Effective People", category: "Books", price: 399, stock: 33, rating: 4.5 },
  { name: "Grokking Algorithms", category: "Books", price: 899, stock: 18, rating: 4.4 },
  { name: "Eloquent JavaScript", category: "Books", price: 749, stock: 22, rating: 4.5 },
  { name: "The Subtle Art of Not Giving a F*ck", category: "Books", price: 349, stock: 38, rating: 4.3 },
  { name: "Company of One", category: "Books", price: 499, stock: 24, rating: 4.2 },
  { name: "Educated: A Memoir", category: "Books", price: 449, stock: 28, rating: 4.6 },
  { name: "Where the Crawdads Sing", category: "Books", price: 399, stock: 30, rating: 4.5 },

  // ---------------- Sports (25) ----------------
  { name: "Yoga Mat Anti-Slip", category: "Sports", price: 749, stock: 40, rating: 4.3 },
  { name: "Adjustable Dumbbell Set", category: "Sports", price: 4499, stock: 8, rating: 4.5 },
  { name: "Resistance Bands Set", category: "Sports", price: 599, stock: 45, rating: 4.2 },
  { name: "Football Size 5", category: "Sports", price: 899, stock: 30, rating: 4.3 },
  { name: "Cricket Bat Kashmir Willow", category: "Sports", price: 1499, stock: 20, rating: 4.2 },
  { name: "Badminton Racket Set (2pc)", category: "Sports", price: 1299, stock: 25, rating: 4.3 },
  { name: "Skipping Rope Speed", category: "Sports", price: 299, stock: 60, rating: 4.1 },
  { name: "Basketball Size 7", category: "Sports", price: 999, stock: 22, rating: 4.2 },
  { name: "Gym Gloves Padded", category: "Sports", price: 449, stock: 48, rating: 4.0 },
  { name: "Foam Roller for Muscle Recovery", category: "Sports", price: 899, stock: 18, rating: 4.3 },
  { name: "Table Tennis Racket Pair", category: "Sports", price: 799, stock: 26, rating: 4.1 },
  { name: "Camping Tent 2-Person", category: "Sports", price: 3499, stock: 10, rating: 4.4 },
  { name: "Trekking Backpack 40L", category: "Sports", price: 2299, stock: 15, rating: 4.5 },
  { name: "Cycling Helmet", category: "Sports", price: 1199, stock: 22, rating: 4.3 },
  { name: "Swimming Goggles Anti-Fog", category: "Sports", price: 499, stock: 35, rating: 4.1 },
  { name: "Jump Rope Weighted", category: "Sports", price: 399, stock: 40, rating: 4.0 },
  { name: "Football Studs Shoes", category: "Sports", price: 1999, stock: 16, rating: 4.3 },
  { name: "Yoga Block Set (2pc)", category: "Sports", price: 449, stock: 38, rating: 4.1 },
  { name: "Fitness Tracker Band", category: "Sports", price: 1799, stock: 24, rating: 4.2 },
  { name: "Boxing Gloves 12oz", category: "Sports", price: 1299, stock: 19, rating: 4.3 },
  { name: "Water Bottle Sports 1L", category: "Sports", price: 349, stock: 55, rating: 4.0 },
  { name: "Badminton Shuttlecocks (Pack of 6)", category: "Sports", price: 399, stock: 42, rating: 4.1 },
  { name: "Ab Roller Wheel", category: "Sports", price: 599, stock: 30, rating: 4.2 },
  { name: "Hiking Pole Adjustable (Pair)", category: "Sports", price: 1099, stock: 20, rating: 4.2 },
  { name: "Kettlebell 8kg", category: "Sports", price: 1499, stock: 14, rating: 4.4 },
];

// Words that don't help identify a product visually - stripped before
// building the search keywords used to fetch a matching photo.
const STOPWORDS = new Set([
  "the", "for", "with", "and", "of", "pack", "set", "pair", "edition",
  "anti", "fast", "smart", "portable", "adjustable", "new", "size",
  "inch", "full", "high", "quality", "premium",
]);

// Builds 1-2 meaningful keywords from a product name (strips parenthetical
// notes, numbers, and units like "20000mAh" or "1.5L") for image lookup.
const getImageKeywords = (name) => {
  const words = name
    .replace(/\(.*?\)/g, " ")
    .replace(/[^a-zA-Z\s]/g, " ")
    .split(/\s+/)
    .map((w) => w.toLowerCase())
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));

  return words.slice(0, 2).join(",") || "product";
};

// LoremFlickr returns a real photo matching the given keyword(s). The
// `lock` param pins a specific image per product so it stays consistent
// across reseeds/reloads instead of randomizing on every request.
const getProductImageUrl = (name, lockId) => {
  const keywords = IMAGE_KEYWORD_OVERRIDES[name] || getImageKeywords(name);
  return `https://loremflickr.com/400/400/${keywords}/all?lock=${lockId}`;
};

// Explicit overrides for product names where auto-extracted keywords from
// the name alone are too generic/ambiguous and risk returning an unrelated
// photo (e.g. "Smart LED TV" auto-extracting to a mismatched result).
// Every Electronics product is mapped explicitly since these names are the
// most prone to keyword-search mismatches.
const IMAGE_KEYWORD_OVERRIDES = {
  "Wireless Bluetooth Headphones": "headphones",
  "Smart Fitness Watch": "smartwatch",
  "Portable Power Bank 20000mAh": "powerbank,battery",
  "USB-C Fast Charger 65W": "charger,cable",
  "Mechanical Gaming Keyboard": "keyboard,gaming",
  "Wireless Mouse Ergonomic": "computer,mouse",
  "Bluetooth Portable Speaker": "speaker,bluetooth",
  "Noise Cancelling Earbuds": "earbuds,earphones",
  "27-inch Full HD Monitor": "computer,monitor",
  "1TB External Hard Drive": "harddrive,storage",
  "Smartphone Tripod Stand": "tripod,phone",
  "Webcam 1080p with Mic": "webcam",
  "Smart LED TV 43-inch": "television,tv",
  "Wireless Charging Pad": "phone,charging",
  "Gaming Mousepad XL": "mousepad,desk",
  "Action Camera 4K": "actioncamera,camera",
  "Smart Home Wi-Fi Plug": "smartplug,socket",
  "Portable Bluetooth Projector": "projector",
  "USB Hub 4-Port 3.0": "usb,hub",
  "Laptop Cooling Pad": "laptop,cooling",
  "Smart Digital Alarm Clock": "alarmclock,clock",
  "Car Bluetooth FM Transmitter": "cardashboard,car",
  "Wireless Earbuds Sports Edition": "earbuds,sports",
  "Graphic Tablet for Drawing": "drawingtablet,stylus",
  "Smart Video Doorbell": "doorbell,camera",
};

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    await Promise.all([
      User.deleteMany({}),
      Product.deleteMany({}),
      Cart.deleteMany({}),
      Order.deleteMany({}),
    ]);
    console.log("Cleared existing users, products, carts, and orders");

    const admin = await User.create({
      fullName: "Admin User",
      email: "admin@example.com",
      password: "Admin@123",
      role: "admin",
    });
    console.log("Admin user created:", admin.email);

    const sampleUsers = [
      { fullName: "Aarav Sharma", email: "aarav@example.com", password: "User@123" },
      { fullName: "Priya Nair", email: "priya@example.com", password: "User@123" },
      { fullName: "Rohan Mehta", email: "rohan@example.com", password: "User@123" },
      { fullName: "Sneha Iyer", email: "sneha@example.com", password: "User@123" },
      { fullName: "Karan Verma", email: "karan@example.com", password: "User@123" },
    ];
    const createdUsers = await User.insertMany(sampleUsers);
    console.log(`${createdUsers.length} sample users created`);

    const productsToInsert = sampleProducts.map((p, index) => ({
      ...p,
      description: `${p.name} - high quality ${p.category.toLowerCase()} product perfect for everyday use. Durable, reliable and great value for money.`,
      image: getProductImageUrl(p.name, index + 1),
      createdBy: admin._id,
    }));

    const createdProducts = await Product.insertMany(productsToInsert);
    console.log(`${createdProducts.length} sample products created`);

    console.log("\n✅ Seed data inserted successfully!");
    console.log("Admin login -> email: admin@example.com | password: Admin@123");

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seed();
