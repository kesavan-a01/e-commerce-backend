const mongoose = require("mongoose");

// In serverless environments (Vercel), functions can be invoked many times
// and each invocation could open a new DB connection if we're not careful.
// We cache the connection on the global object so warm invocations reuse it.
let cached = global.mongooseConnection;

if (!cached) {
  cached = global.mongooseConnection = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined in environment variables");
  }

  if (!cached.promise) {
    const options = {
      bufferCommands: false,
    };

    cached.promise = mongoose
      .connect(process.env.MONGO_URI, options)
      .then((mongooseInstance) => {
        console.log("MongoDB Atlas connected successfully");
        return mongooseInstance;
      })
      .catch((err) => {
        console.error("MongoDB connection error:", err.message);
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

module.exports = connectDB;
