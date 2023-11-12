const express = require("express");
const router = express.Router();
const ruleController = require("../controllers/ruleController");
const mqttController = require("../controllers/mqttcontroller");

router.get("/latestId", ruleController.findLatestRuleId);
router.get("/", ruleController.getAllRules);
router.get("/:rule_id", ruleController.getRuleByRule_id);
router.post("/", ruleController.createOrUpdateRule);
router.put("/:rule_id", ruleController.updateRule);
router.delete("/all", ruleController.deleteAllRule);
router.delete("/:rule_id", ruleController.deleteRule);

// API Endpoint for publishing all rule
router.post("/publish", mqttController.publishAllRulesToMqtt);

module.exports = router;
