const mongoose = require("mongoose");

// Define your MongoDB connection string. Use your Atlas connection string as a Config Var in Heroku.
const connectionString =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/social-network";

// Connect to MongoDB using Mongoose
mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = mongoose.connection; // Export the Mongoose connection object
