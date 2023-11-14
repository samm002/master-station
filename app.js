const express = require("express");
const mongoose = require("mongoose");
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000;
const ruleRoutes = require("./routes/ruleRoute");
const deviceRoutes = require("./routes/deviceRoute");
const databaseName = "master-station";
const host = `${process.env.MONGO_LOCAL}/${databaseName}`;
const cloudHost = process.env.MONGO_URI

app.use(express.json());
app.use("/rule", ruleRoutes);
app.use("/device", deviceRoutes);

app.get('/', (req, res) => {
  res.send('Master Station is ready to use!')
})

mongoose
  .connect(host)
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});