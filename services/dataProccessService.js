const { getAllLatestDeviceValue } = require("../services/deviceService");

const getPublishedDevice = (device) => {
  return {
    device_id: device.device_id,
    device_value: device.device_value,
    timestamp: device.timestamp,
  };
};

const getDeviceCompareData = (device) => {
  return {
    device_id: device.device_id,
    device_value: device.device_value,
  };
};

const comparedDeviceData = async () => {
  const devices = await getAllLatestDeviceValue();
  return devices.map((device) => getDeviceCompareData(device));
};

const transformObject = (obj) => {
  const transformedObject = {};
  transformedObject[obj.device_id] = obj.device_value;
  return transformedObject;
};

const mergeObjectsFromArray = (arrayOfObjects) => {
  return arrayOfObjects.reduce((result, currentObj) => {
    for (const key in currentObj) {
      result[key] = currentObj[key];
    }
    return result;
  }, {});
};

module.exports = {
  getPublishedDevice,
  getDeviceCompareData,
  comparedDeviceData,
  transformObject,
  mergeObjectsFromArray,
};
