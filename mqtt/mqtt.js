const mqtt = require("mqtt");
require("dotenv").config();

const { local, cool, emqx } = require('./brokerSetting')

const client = mqtt.connect(cool);
const topics = ["trigger", "device"];

client.on("connect", () => {
  console.log("Connected to MQTT broker...");
  client.subscribe(topics, (err) => {
    if (!err) {
      console.log(`Master station successfully subscribed to topic : ${topics.join(', ')}`);
      console.log("Waiting for MQTT messages...");
    } else {
      console.log(`Subscribed to topic : ${topics.join(', ')} failed`);
      console.log('error :', err);
    }
  });
});

client.on("disconnect", (packet) => {
  console.log(packet);
});

client.on("error", (error) => {
  console.error("MQTT client error:", error.message);
});

client.on("close", () => {
  console.log("Disconnected from MQTT broker");
});

module.exports = {
  client,
};
