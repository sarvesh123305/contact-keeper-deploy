const mongoose = require("mongoose");
require("dotenv").config();
const db = process.env.MONGOURI;

const connectDB = () => {
  mongoose
    .connect(db, {})
    .then(() => console.log("Mongodb connected"))
    .catch((err) => {
      console.error("Mongodb connection failed:", err);
      process.exit(1);
    });
};

module.exports = connectDB;
