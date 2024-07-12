const express = require("express");
const app = express();
const connectDB = require("./config/db");
const path = require("path");
//connect database

connectDB();
//Init middleware

// app.use(express.json({extended:false}));
app.use(express.json());

//app.get("/", (req, res) => res.json({ msg: "Welcome contact keeper api" }));

//define routes

app.use("/api/users", require("./routes/users"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/contacts", require("./routes/contacts"));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("server started burum burum"));
