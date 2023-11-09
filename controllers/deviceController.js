const deviceService = require('../services/deviceService')

const getAllDeviceStatus = async (req, res) => {
  try {
    const devices = await deviceService.getAllDeviceStatus();
    res.json(devices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllLatestDeviceValue = async (req, res) => {
  try {
    const latestDevices = await deviceService.getAllLatestDeviceValue()
    res.json(latestDevices)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getLatestDeviceStatusById = async (req, res) => {
  const { device_id } = req.params;
  try {
    const latestDevice = await deviceService.getLatestDeviceStatusById(device_id)
    res.json(latestDevice)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createNewDeviceStatus = async (req, res) => {
  const { device_id, device_value } = req.body;
  try {
    const newDevice = await deviceService.createNewDeviceStatus(device_id, device_value)
    res.json(newDevice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateLatestDeviceStatusById = async (req, res) => {
  const { device_id } = req.params; // Get the device ID from URL parameters
  const { device_value } = req.body; // Get the new device value from the request body
  const timestamp = new Date().toLocaleString();
  try {
    const updateLatestDevice = await deviceService.updateLatestDeviceStatus(device_id, device_value, timestamp);
    res.json(updateLatestDevice)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteDeviceStatusById = async (req, res) => {
  const { device_id } = req.params;
  try {
    const deletedDevices = await deviceService.deleteDeviceStatusById(device_id)
    res.json(deletedDevices)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteAllDeviceStatus = async (req, res) => {
  try {
    const deletedDevices = await deviceService.deleteAllDeviceStatus()
    res.json(deletedDevices)
  } catch {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getAllDeviceStatus,
  getAllLatestDeviceValue,
  getLatestDeviceStatusById,
  createNewDeviceStatus,
  updateLatestDeviceStatusById,
  deleteDeviceStatusById,
  deleteAllDeviceStatus,
};
