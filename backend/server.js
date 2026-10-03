const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");
const feedbackRoutes = require("./routes/feedbackRoutes");

dotenv.config();

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
    app.listen(5000, () => {
      console.log("Server running at http://localhost:5000");
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error.message);
  });