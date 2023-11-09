const mongoose = require("mongoose");

const deviceSchema = new mongoose.Schema({
  device_id: Number,
  device_value: Number,
  timestamp: String,
});

deviceSchema.path('timestamp').default(() => new Date().toLocaleString());

const Device = mongoose.model("Device", deviceSchema);

module.exports = Device;
