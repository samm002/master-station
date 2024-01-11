require("dotenv").config();
const express = require("express");
const app = express();
const port = 3000;
const ruleRoutes = require("./routes/ruleRoute");
const deviceRoutes = require("./routes/deviceRoute");
const { mongoDBSetup } = require("./mongoDB/mongoDBSetup");
const { mqttSetup } = require("./mqtt/mqttSetup");

app.use(express.json());
app.use("/rule", ruleRoutes);
app.use("/device", deviceRoutes);

app.get("/", (req, res) => {
  res.send("Master Station is ready to use!");
});

mongoDBSetup();
mqttSetup();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
