const mongoose = require("mongoose");
const moment = require("moment");

const deviceSchema = new mongoose.Schema({
  device_id: Number,
  device_value: Number,
  timestamp: String,
});

deviceSchema.path('timestamp').default(() => moment().format("MM/DD/YYYY, HH:mm:ss"));

const Device = mongoose.model("Device", deviceSchema);

module.exports = Device;
