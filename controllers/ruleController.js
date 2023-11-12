const ruleService = require('../services/ruleService')

const getAllRules = async (req, res) => {
  try {
    const rules = await ruleService.getAllRules();
    res.json(rules);
  } catch (error) {
    console.error('error :', error)
    res.status(500).json({ error: "Failed to retrieve rules", detail: error.message});
  }
};

const findLatestRuleId = async (req, res) => {
  try {
    const rule = await ruleService.findLatestRuleId();
    res.json(rule);
  } catch (error) {
    console.error('error :', error)
    res.status(500).json({ error: "Failed to latest rule_id", detail: error.message});
  }
};

const getRuleByRule_id = async (req, res) => {
  const { rule_id } = req.params;
  try {
    const rule = await ruleService.getRuleByRule_id(rule_id);
    res.json(rule);
  } catch (error) {
    console.error('error :', error)
    res.status(500).json({ error: "Failed to retrieve rule by id", detail: error.message});
  }
};

const createOrUpdateRule = async (req, res) => {
  const { rule_id, trigger, service } = req.body;
  const latestRuleId = await ruleService.findLatestRuleId();
  let getLatest_ruleId
  
  if (latestRuleId) {
    getLatest_ruleId =  parseInt(latestRuleId.rule_id, 10) + 1
  } else {
    getLatest_ruleId = 1
  }
  
  try {
    if (!rule_id) {
      const rule = await ruleService.createOrUpdateRule(getLatest_ruleId, trigger, service);
      res.json(rule);
    } else {
      const rule = await ruleService.createOrUpdateRule(rule_id, trigger, service);
      res.json(rule);
    }
  } catch (error) {
    console.error('error :', error)
    res.status(500).json({ error: "Failed to create/update rule", detail: error.message });
  }
};

const updateRule = async (req, res) => {
  const { rule_id } = req.params;
  const { trigger, service } = req.body;

  try {
    const updatedRule = await ruleService.updateRule(rule_id, trigger, service);
    res.json(updatedRule)

  } catch (error) {
    console.error('error :', error)
    res.status(500).json({ error: "Failed to update rule", detail: error.message});
  }
};

const deleteRule = async (req, res) => {
  const { rule_id } = req.params;
  try {
    const deletedRule = await ruleService.deleteRule(rule_id);
    res.json(deletedRule)
  } catch (error) {
    console.error('error :', error)
    res.status(500).json({ error: "Failed to delete rule", detail: error.message });
  }
};

const deleteAllRule = async (req, res) => {
  try {
    const deletedRule = await ruleService.deleteAllRule();
    res.json(deletedRule)
  } catch (error) {
    console.error('error :', error)
    res.status(500).json({ error: "Failed to delete rule", detail: error.message });
  }
};

module.exports = {
  findLatestRuleId,
  getAllRules,
  getRuleByRule_id,
  createOrUpdateRule,
  updateRule,
  deleteRule,
  deleteAllRule,
};
