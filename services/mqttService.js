const moment = require("moment");
const Device = require("../models/deviceModel");
let timeout;
const { client } = require("../mqtt/mqttSetup");
const { getAllRules } = require("../services/ruleService");
const {
  getPublishedDevice,
  getDeviceCompareData,
  comparedDeviceData,
  transformObject,
  mergeObjectsFromArray,
} = require("../services/dataProccessService");

const ackTimeout = (duration) => {
  timeout = setTimeout(async () => {
    console.log(
      "Timeout! Did not receive any message from service device within 5 second"
    );
  }, duration);
};

const clearAckTimeout = () => {
  clearTimeout(timeout);
}

const publishAllRulesToMqttService = async (topic) => {
  const message = `Rules published to topic : ${topic}`;
  const timestamp = moment().format("MM/DD/YYYY, HH:mm:ss");
  try {
    const rules = await getAllRules();

    rules.forEach((rule) => {
      const payload = JSON.stringify(rule);
      client.publish(topic, payload, (error) => {
        if (error) {
          console.error(`Failed to publish rule: ${JSON.stringify(rule)}`);
        }
      });
    });

    console.log(message);
    return { "Publish Time": timestamp, message, rules };
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
  console.log("latest device status", latestDeviceValues);

  // map the device data to have same format as rule trigger
  const transformed = latestDeviceValues.map(transformObject);

  console.log("transformed latest device status :", transformed);

  // merge array of mapped object device data become 1 object
  const mergedObject = mergeObjectsFromArray(transformed);

  // console.log("merged transformed latest device status :", mergedObject);

  const matchingRules = [];
  const candidateRules = [];
  let maxTotalTrigger = 0;

  console.log("\nCurrent Device Statuses :", mergedObject);

  rules.forEach((rule) => {
    const trigger = rule.trigger;
    // console.log(rule);
    const totalTrigger = Object.keys(trigger).length;
    if (isRuleMatch(mergedObject, trigger)) {
      candidateRules.push(rule);
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

  candidateRules.length > 1
    ? console.log(
        `\nMatched Rule Candidates (total : ${candidateRules.length}) :`
      )
    : console.log(
        `\nMatched Rule Candidate (total : ${candidateRules.length}) :`
      );
  for (const rule of candidateRules) {
    console.log(rule);
  }

  if (matchingRules.length !== 0) {
    if (matchingRules.length === 1) {
      console.log(
        `\nThere is a matched rule in rule_id : ${matchingRules[0].rule_id}`
      );
      console.log("\nMatched Rule :");
      console.log(matchingRules[0]);
    } else {
      const matchedRuleId = matchingRules
        .map((matchedRule) => matchedRule.rule_id)
        .join(", ");
      console.log(
        `\nThere are ${matchingRules.length} matched rules in rule_id : ${matchedRuleId}`
      );
      console.log("\nMatched Rules :");
      for (const rule of matchingRules) {
        console.log(rule);
      }
    }
  } else {
    console.log("No matching rule found");
  }
  return matchingRules;
};

// Comment ketika tes fungsional bersama
const publishMatchingRules = async (matchingRules) => {
  const publishedTopic = "service";
  console.log("\nPublishing Matched Rules :\n");
  matchingRules.forEach(async (matchingRule) => {
    for (const device_id in matchingRule.service) {
      const serviceData = {
        [device_id]: matchingRule.service[device_id],
      };
      const deviceId = Object.keys(serviceData)[0];
      const serviceValue = serviceData[device_id];
      const serviceDevice = new Device({
        device_id: deviceId,
        device_value: serviceValue,
      });
      
      const publishedPayload = getDeviceCompareData(serviceDevice);      
      publishMqttMessage(publishedTopic, publishedPayload);
    }
  });
};

const ackReceivedFromService = async (payload) => {
  // Service Device kirim kondisi device terbaru sebagai ACK
  // Contoh : {"device_id":3, "device_value":1}
  const serviceDevice = new Device(payload);
  const serviceId = serviceDevice.device_id;
  const savedDevice = await serviceDevice.save();
  console.log('\nReceived ACK message from service device id :', serviceId, '\nMessage :', payload)
  console.log('\nService Device Saved to Database :\n', savedDevice);  
}

const publishAckToTrigger = async (trigger_id) => {
  const topic = 'trigger_ack';
  const payload = {
    status: 'success',
    device_id: trigger_id,
  };
  console.log('\nSending ACK message to triger device id :', trigger_id);
  publishMqttMessage(topic, payload);
}

const publishMqttMessage = (topic, message) => {
  const payload = JSON.stringify(message);
  client.publish(topic, payload, (error) => {
    if (error) {
      console.error(
        `Failed to publish service data to topic ${topic}, message :`,
        message,
        "\n"
      );
    } else {
      console.log(`Message published to topic ${topic}, message :`, message, '\n');
    }
  });
};

module.exports = {
  ackTimeout,
  clearAckTimeout,
  publishAllRulesToMqttService,
  saveDeviceToDatabase,
  isRuleMatch,
  findMatchingRules,
  publishMatchingRules,
  ackReceivedFromService,
  publishAckToTrigger,
};
