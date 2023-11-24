const { client } = require("../mqtt/mqttSetup");
const {
  publishAllRulesToMqttService,
  saveDeviceToDatabase,
  findMatchingRules,
  publishMatchingRules,
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
    if (topic === "trigger") {
      if (payload) {
        // publishAllRulesToMqtt()
        const parsedPayload = JSON.parse(payload);
        console.log("\nMessage received from trigger device :", parsedPayload);
        saveDeviceToDatabase(parsedPayload);
        const matchedRules = await findMatchingRules();
        // console.log("matched rules :", matchedRules);
        publishMatchingRules(matchedRules);
      }
    } else if (topic === "device") {
      if (payload) {
        const parsedPayload = JSON.parse(payload);
        console.log("\nMessage received from service device :", parsedPayload);
        saveDeviceToDatabase(parsedPayload);
        // Clear the retained message on the "device" topic
        // client.publish("device", '', { retain: true });
      }
    }
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  publishAllRulesToMqtt,
};
