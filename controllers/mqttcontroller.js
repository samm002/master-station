const timeout = 5000
let triggerId;
const { client } = require("../mqtt/mqttSetup");
const {
  publishAllRulesToMqttService,
  saveDeviceToDatabase,
  findMatchingRules,
  publishMatchingRules,
  ackReceivedFromService,
  publishAckToTrigger,
  ackTimeout,
  clearAckTimeout,
  publishService_ACK,
} = require("../services/mqttService");

const publishAllRulesToMqtt = async (req, res) => {
  const topic = "rule";
  try {
    const publish = await publishAllRulesToMqttService(topic);
    res.json(publish);
  } catch (error) {
    console.error("error :", error);
    res.status(500).json({
      error: `Failed to publish rules to ${topic} topic`,
      detail: error.message,
    });
  }
};

client.on("message", async (topic, payload) => {
  try {
    if (payload) {
      const parsedPayload = JSON.parse(payload);
      if (topic === "trigger") {
        triggerId = parsedPayload.device_id;
        console.log("\nMessage received from trigger device :", parsedPayload);
        await saveDeviceToDatabase(parsedPayload);
        const matchedRules = await findMatchingRules();
        if (matchedRules.length != 0) {
          publishMatchingRules(matchedRules);
          ackTimeout(timeout);
          console.log("Waiting for ACK Messages...");
        } else {
          console.log("\nWaiting for MQTT messages...")
        }
      } else if (topic === "service_ack") {
        await ackReceivedFromService(parsedPayload);
        publishAckToTrigger(triggerId);
        clearAckTimeout();
      }
    }
  } catch (error) {
    throw error;
  }
});

module.exports = {
  publishAllRulesToMqtt,
};
