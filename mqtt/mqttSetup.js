const mqtt = require("mqtt");
const { local, cool, emqx } = require('./brokerSetting')
const client = mqtt.connect(cool);
const topics = ["trigger", "service_ack"];

const mqttSetup = () => {
  client.on("connect", () => {
    console.log("Connected to MQTT broker...");
    client.subscribe(topics, (err) => {
      if (!err) {
        console.log(`Master station successfully subscribed to topic : ${topics.join(', ')}`);
        console.log("Waiting for MQTT messages...");
      } else {
        console.error(`Subscribed to topic : ${topics.join(', ')} failed`);
        console.error('error :', err);
      }
    });
  });
  
  client.on("disconnect", (packet) => {
    console.log(packet);
  });
  
  client.on("error", (error) => {
    console.error("MQTT client error:", error.message);
  });
  
  client.on("close", (message) => {
    console.log("Disconnected from MQTT broker", message);
  }); 
}

module.exports = {
  client,
  mqttSetup,
};
