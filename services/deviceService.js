const Device = require("../models/deviceModel");

const deviceFormat = (device) => {
  return {
    device_id: device.device_id,
    device_value: device.device_value,
    timestamp: device.timestamp,
  };
};

const latestDeviceFormat = async () => {
  const latestDevices = await Device.aggregate([
    { $sort: { device_id: 1, timestamp: -1 } },
    {
      $group: {
        _id: "$device_id",
        device_id: { $first: "$device_id" }, // Keep the field name as 'device_id'
        device_value: { $first: "$device_value" },
        timestamp: { $first: "$timestamp" },
      },
    },
    // Project to exclude the '_id' field
    {
      $project: {
        _id: 0,
        device_id: 1,
        device_value: 1,
        timestamp: 1,
      },
    },
    {
      $sort: { device_id: 1 }, // Sort the result by 'device_id' in ascending order
    },
  ]);
  return latestDevices;
};

const getAllDeviceStatus = async () => {
  try {
    const devices = await Device.find().sort({ device_id: 1, timestamp: -1 });
    const devicesCount = await Device.countDocuments();
    if (devicesCount !== 0) {
      if (devicesCount === 1) {
        return {
          "Total Device": devicesCount,
          Devices: deviceFormat(devices[0]),
        };
      } else {
        const mappedDevices = devices.map((device) => deviceFormat(device));
        return { "Total Devices": devicesCount, Devices: mappedDevices };
      }
    } else {
      return {
        error:
          "Failed getting device statuses, database empty, nothing to show",
        "total devices": devicesCount,
      };
    }
  } catch (error) {
    throw error;
  }
};

const getAllLatestDeviceStatus = async () => {
  try {
    const devicesCount = await Device.countDocuments();
    const latestDevices = await latestDeviceFormat();
    if (devicesCount !== 0) {
      return latestDevices;
    } else {
      return {
        error:
          "Failed getting device statuses, database empty, nothing to show",
        "Total Devices": devicesCount,
      };
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get latest device statuses");
  }
};

const getLatestDeviceStatusById = async (device_id) => {
  try {
    const latestDevice = await Device.find({ device_id })
      .sort({ timestamp: -1 })
      .limit(1);
    if (latestDevice) {
      return deviceFormat(latestDevice[0]);
    } else {
      return { error: `Device with device_id : ${device_id} not found` };
    }
  } catch (error) {
    throw new Error("Failed to get latest device status");
  }
};

const createNewDeviceStatus = async (device_id, device_value) => {
  try {
    const device = new Device({ device_id, device_value });
    const newDevice = await device.save();
    return deviceFormat(newDevice);
  } catch (error) {
    throw new Error("Failed to create new device");
  }
};

const updateLatestDeviceStatus = async (device_id, device_value, timestamp) => {
  try {
    const latestDevice = await Device.findOne({ device_id }).sort({
      timestamp: -1,
    });
    if (latestDevice) {
      if (device_value) {
        latestDevice.device_value = device_value;
        if (timestamp) {
          latestDevice.timestamp = timestamp;
        }
        const updatedLatestDevice = await latestDevice.save();
        return deviceFormat(updatedLatestDevice);
      }
    } else {
      return {
        error: `Failed updating device, device with device_id ${device_id} not found`,
      };
    }
  } catch (error) {
    throw new Error("Failed to update latest device status");
  }
};

const deleteDeviceStatusById = async (device_id) => {
  try {
    const deletedDevices = await Device.deleteMany({ device_id });
    if (deletedDevices.deletedCount !== 0) {
      return {
        Message: `Successfully delete all devices status with id ${device_id}`,
        detail: deletedDevices,
      };
    } else {
      return {
        error: `Failed deleting device, device with device_id ${device_id} not found`,
      };
    }
  } catch (error) {
    throw new Error(`Failed to delete devices with id : ${device_id}`);
  }
};

const deleteAllDeviceStatus = async () => {
  try {
    const deletedDevices = await Device.deleteMany();
    if (deletedDevices.deletedCount !== 0) {
      return {
        Message: `Successfully delete all devices`,
        detail: deletedDevices,
      };
    } else {
      return {
        error: "Failed deleting device, database empty, nothing to delete",
      };
    }
  } catch (error) {
    throw new Error("Failed to delete all device status");
  }
};

module.exports = {
  getAllDeviceStatus,
  getAllLatestDeviceStatus,
  getLatestDeviceStatusById,
  createNewDeviceStatus,
  updateLatestDeviceStatus,
  deleteDeviceStatusById,
  deleteAllDeviceStatus,
};
