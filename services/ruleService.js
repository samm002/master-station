const Rule = require("../models/ruleModel");

const ruleFormat = (rule) => {
  return {
    rule_id: rule.rule_id,
    trigger: rule.trigger,
    service: rule.service,
  };
};

const getAllRules = async () => {
  try {
    const rulesCount = await Rule.countDocuments();
    const rules = await Rule.find().sort({ rule_id: 1 });
    if (rulesCount !== 0) {
      if (rulesCount === 1) {
        return {
          "Total Device": rulesCount,
          Rules: ruleFormat(rules[0]),
        };
      } else {
        const mappedRules = rules.map((rule) => ruleFormat(rule));
        return { "Total Rules": rulesCount, Rules: mappedRules };
      }
    } else {
      return {
        error: "Failed getting device statuses, database empty, nothing to show",
        "total rules": rulesCount,
      };
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get all rules data");
  }
};

const getRuleByRule_id = async (rule_id) => {
  try {
    const rule = await Rule.findOne({ rule_id });
    console.log(`Getting rule with rule_id : ${rule_id}`);
    if (rule) {
      return ruleFormat(rule);
    } else {
      return { error: `Rule with rule_id : ${rule_id} not found` };
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get rule data by id");
  }
};

const getLatestRuleId = async () => {
  try {
    const rulesCount = await Rule.countDocuments();
    const rule = await Rule.findOne(
      {},
      null,
      { sort: { rule_id: -1 } }
    );
    if (rule) {
      return ruleFormat(rule);
    } else {
      return {
        error: "Failed getting latest rule created, database empty, nothing to show",
        "total devices": rulesCount,
      };
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get latest rule by id");
  }
};

const createOrUpdateRule = async (rule_id, trigger, service) => {
  try {
    const rule = await Rule.findOne({ rule_id });
    console.log(`Creating / Updating rule`);

    if (rule) {
      rule.trigger = trigger;
      rule.service = service;
      const updatedRule = await rule.save();
      console.log(`Rule_id : ${rule.rule_id} already exist, updating the rule`);
      return updatedRule;
    } else {
      const newRule = new Rule({ rule_id, trigger, service });
      const savedNewRule = await newRule.save();
      console.log(`Created new rule with rule_id : ${savedNewRule.rule_id}`);
      return savedNewRule;
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create new rule");
  }
};

const updateRule = async (rule_id, trigger, service) => {
  try {
    const rule = await Rule.findOne({ rule_id });
    console.log(`Updating rule`);

    if (rule) {
      if (trigger) {
        rule.trigger = trigger;
      }
      if (service) {
        rule.service = service;
      }
      const updatedRule = await rule.save();
      console.log(`rule id : ${rule_id} updated successfully`);
      return ruleFormat(updatedRule);
    } else {
      console.log(`Failed updating rule, rule with rule_id : ${rule_id} not found`);
      return {
        error: `Failed updating rule, rule with rule_id ${rule_id} not found`,
      };
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update rule");
  }
};

const deleteRule = async (rule_id) => {
  try {
    const result = await Rule.deleteOne({ rule_id });
    if (result.deletedCount === 1) {
      console.log(`rule id : ${rule_id} deleted successfully`);
      return { message: `rule id : ${rule_id} deleted successfully` };
    } else {
      console.log(`Failed deleting rule, rule with rule_id : ${rule_id} not found`);
      return {
        error: `Failed updating rule, rule with rule_id ${rule_id} not found`,
      };
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete rule by id");
  }
};

const deleteAllRule = async () => {
  try {
    const deletedRules = await Rule.deleteMany();
    if (deletedRules.deletedCount === 1) {
      return {
        Message: `Successfully delete all rules`,
        detail: deletedRules,
      };
    } else {
      return {
        error: "Failed deleting rule, database empty, nothing to delete",
      };
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to delete all rule");
  }
};

module.exports = {
  getAllRules,
  getLatestRuleId,
  getRuleByRule_id,
  createOrUpdateRule,
  updateRule,
  deleteAllRule,
  deleteRule,
};
