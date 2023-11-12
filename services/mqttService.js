const { client } = require('../mqtt/mqtt')


const publishAllRulesToMqtt = async (req, res) => {
  const topic = "rule";
  const message = `Rules published to topic : ${topic}`;
  const timestamp = new Date().toLocaleString();
  try {
    const rulesMap = await getAllRules();

    rulesMap.forEach((ruleData) => {
      const payload = JSON.stringify(ruleData);
      client.publish(topic, payload, (error) => {
        if (error) {
          console.error(`Failed to publish rule: ${JSON.stringify(ruleData)}`);
        }
      });
    });

    console.log(message);
    res.json({ "Publish Time": timestamp, message, rules: rulesMap });
  } catch (error) {
    console.error("Failed to retrieve or publish rules:", error);
    throw error;
  }
};

const saveDeviceToDatabase = async (receivedData) => {
  const { device_id, device_value } = receivedData;
  try {
    const device = new Device({ device_id, device_value });
    const newDevice = await device.save();
    const response = {
      status: "Device status saved to database",
      detail: getPublishedDevice(newDevice),
    };
    console.log(response, "\n");
    return newDevice;
  } catch (error) {
    console.error("Failed to saved device status in database", error);
    throw error;
  }
};