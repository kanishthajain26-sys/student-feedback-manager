const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const dns = require("dns");

dotenv.config();


if (process.env.NODE_ENV !== "production") {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
}

const connectDB = require("./config/db");
const feedbackRoutes = require("./routes/feedbackRoutes");

const app = express();

app.use(cors());
app.use(express.json());


app.use(express.static(path.join(__dirname, "../frontened")));


app.use("/api", feedbackRoutes);


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontened/index.html"));
});

connectDB()
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });

if (process.env.NODE_ENV !== "production") {
  app.listen(5000, () => {
    console.log("Server running at http://localhost:5000");
  });
}


module.exports = app;