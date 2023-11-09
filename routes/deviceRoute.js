const express = require("express");
const router = express.Router();
const deviceController = require("../controllers/deviceController");

router.get("/", deviceController.getAllDeviceStatus);
router.get("/latest", deviceController.getAllLatestDeviceValue);
router.get("/:device_id", deviceController.getLatestDeviceStatusById);
router.post("/", deviceController.createNewDeviceStatus);
router.put("/:device_id", deviceController.updateLatestDeviceStatusById);
router.delete("/all", deviceController.deleteAllDeviceStatus);
router.delete("/:device_id", deviceController.deleteDeviceStatusById);

module.exports = router;
