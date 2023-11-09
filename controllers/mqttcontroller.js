const { client } = require("../Mqtt/mqtt");
const { getAllRules } = require("../services/ruleService");
const Device = require("../models/deviceModel");
const {
  getPublishedDevice,
  getDeviceCompareData,
  comparedDeviceData,
  transformObject,
  mergeObjectsFromArray,
} = require("../services/dataProccessService");

const publishAllRulesToMqtt = async (req, res) => {
  const publishTopic = "rule";
  const message = `Rules published to ${publishTopic} topic`;
  const timestamp = new Date().toLocaleString();
  try {
    const rulesMap = await getAllRules();

    rulesMap.forEach((ruleData) => {
      client.publish(publishTopic, JSON.stringify(ruleData), (error) => {
        if (error) {
          console.error(`Failed to publish rule: ${JSON.stringify(ruleData)}`);
        }
      });
    });
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
    const response = { status: "Device status saved to database", detail: getPublishedDevice(newDevice) } 
    console.log(response, '\n');
    return newDevice;
  } catch (error) {
    throw error;
  }
};

const isRuleMatch = (deviceValue, ruleTrigger) => {
  for (const key in ruleTrigger) {
    if (
      ruleTrigger[key] !== deviceValue[key] &&
      ruleTrigger[key] !== undefined
    ) {
      return false;
    }
  }
  return true;
};

const findMatchingRules = async () => {
  const latestDeviceValues = await comparedDeviceData();
  const rules = await getAllRules();
  // console.log("rules :", rules);
  console.log("latest device status", latestDeviceValues);

  // map the device data to have same format as rule trigger
  const transformed = latestDeviceValues.map(transformObject);

  console.log("transformed latest device status :", transformed);

  // merge array of mapped object device data become 1 object
  const mergedObject = mergeObjectsFromArray(transformed);

  console.log("merged transformed latest device status :", mergedObject);

  const matchingRules = [];
  let maxTotalTrigger = 0;

  console.log("\nCurrent Device Statuses :", mergedObject);
  console.log("\nMatched Rule Candidates :");

  rules.forEach((rule) => {
    const trigger = rule.trigger;
    const totalTrigger = Object.keys(trigger).length;
    if (isRuleMatch(mergedObject, trigger)) {
      console.log(rule);
      if (totalTrigger > maxTotalTrigger) {
        // Jika jumlah key yang cocok lebih banyak dari yang sebelumnya
        // Bersihkan array matchingRules dan tambahkan rule saat ini
        matchingRules.length = 0;
        matchingRules.push(rule);
        maxTotalTrigger = totalTrigger; // Perbarui nilai maxTotalTrigger
      } else if (totalTrigger === maxTotalTrigger) {
        // Jika jumlah key yang cocok sama dengan yang sebelumnya
        // Tambahkan rule saat ini ke array matchingRules
        matchingRules.push(rule);
      }
    }
  });

  if (matchingRules.length !== 0) {
    if (matchingRules.length === 1) {
      console.log(
        `There is a matched rule in rule_id : ${matchingRules[0].rule_id}`
      );
      console.log("\nMatched Rule :");
      console.log(matchingRules[0]);
    } else {
      console.log("\nMatched Rules :");
      for (const rule of matchingRules) {
        // console.log(`There is a matched rule in rule_id : ${rule.rule_id}`);
        console.log(rule);
      }
    }
  } else {
    console.log("No matching rule found");
  }
  return matchingRules;
};

// Comment ketika tes fungsional bersama
const publishMatchingRules = (matchingRules) => {
  const publishedTopic = "service";
  // console.log("\nSaved Current Service Device Status :");
  matchingRules.forEach(async (matchingRule) => {
    for (const device_id in matchingRule.service) {
      const serviceData = {
        [device_id]: matchingRule.service[device_id],
      };
      const deviceId = Object.keys(serviceData)[0]; // Get the key (device_id)
      const serviceValue = serviceData[device_id]; // Get the value (service value)
      const serviceDevice = new Device({
        device_id: deviceId,
        device_value: serviceValue, // Assuming the device_value should be stored from the service data
      });
      // const newDevice = await serviceDevice.save();
      const publishedPayload = getDeviceCompareData(serviceDevice);

      // Tidak jadi menyimpan status data dari master station, tetapi menunggu respone berhasil menerima dari service device
      // const newDevice = await serviceDevice.save();


      // console.log("Saved Device Status : ", getPublishedDevice(newDevice));
      publishToService(publishedTopic, publishedPayload);
    }
  });
};

const publishToService = (topic, message) => {
  client.publish(topic, JSON.stringify(message), (error) => {
    if (error) {
      console.error(
        `Failed to publish service data to topic ${topic}, message :`,
        message,
        "\n"
      );
    } else {
      console.log(
        `Message published to topic ${topic}, message :`,
        message,
        "\n"
      );
    }
  });
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
        console.log("\nMessage received from trigger device :", parsedPayload);
        saveDeviceToDatabase(parsedPayload);
      }
    }
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
  publishAllRulesToMqtt,
};
