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
      const triggerId = parsedPayload.device_id;
      if (topic === "trigger") {
        console.log("\nMessage received from trigger device :", parsedPayload);
        saveDeviceToDatabase(parsedPayload);
        const matchedRules = await findMatchingRules();
        publishMatchingRules(matchedRules);
        ackTimeout(5000);
      } else if (topic === "service_ack") {
        await ackReceivedFromService(parsedPayload);
        publishAckToTrigger(triggerId);
        clearAckTimeout();
      }
    }
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  publishAllRulesToMqtt,
};
