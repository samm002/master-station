const express = require("express");
const mongoose = require("mongoose");
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000;
const ruleRoutes = require("./routes/ruleRoute");
const deviceRoutes = require("./routes/deviceRoute");
const databaseName = "master-station";
const host = `mongodb://127.0.0.1/${databaseName}`;

app.use(express.json());
app.use("/rule", ruleRoutes);
app.use("/device", deviceRoutes);

mongoose
  .connect(host)
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});