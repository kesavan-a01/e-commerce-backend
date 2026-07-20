// Vercel Serverless Function entry point.
// Vercel routes all /api/* requests (see vercel.json) into this single function,
// which reuses the same Express `app` used for local development.
const app = require("../app");
const connectDB = require("../config/db");

module.exports = async (req, res) => {
  await connectDB();
  return app(req, res);
};
