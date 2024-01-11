const express = require("express");
const router = express.Router();
const ruleController = require("../controllers/ruleController");
const mqttController = require("../controllers/mqttcontroller");

router.get("/", ruleController.getAllRules);
router.get("/latestId", ruleController.getLatestRuleId);
router.get("/:rule_id", ruleController.getRuleByRule_id);
router.post("/", ruleController.createOrUpdateRule);
router.put("/:rule_id", ruleController.updateRule);
router.delete("/all", ruleController.deleteAllRule);
router.delete("/:rule_id", ruleController.deleteRule);

router.post("/publish", mqttController.publishAllRulesToMqtt);
router.post("/publish/:rule_id", mqttController.publishRuleById);

module.exports = router;
