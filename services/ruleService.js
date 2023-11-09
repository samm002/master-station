const Rule = require("../models/ruleModel");

const ruleFormat = (rule) => {
  return {
    rule_id: rule.rule_id,
    trigger: rule.trigger,
    service: rule.service,
  };
};

const getAllRules = async () => {
  const rules = await Rule.find();
  return rules.map((rule) => ruleFormat(rule));
};

// const getAllTriggers = async () => {
//   const rules = await Rule.find();
//   const triggerMap = rules.map((rule) => ({
//     trigger: rule.trigger,
//   }));
//   return triggerMap;
// }

const getAllTriggers = async () => {
  const rules = await Rule.find();

  // Extract the trigger objects from the rules and convert them to the desired format
  const triggerDevices = rules.map((rule) => {
    const trigger = rule.trigger;
    return Object.keys(trigger).map(device_id => ({
      device_id: device_id,
      device_value: trigger[device_id],
    }));
  });

  return triggerDevices;
};


const getRuleByRule_id = async (rule_id) => {
  try {
    const rule = await Rule.findOne({ rule_id });
    console.log(`Getting rule with rule_id : ${rule_id}`);
    if (rule) {
      console.log(`Showing rule with rule_id : ${rule_id}`);
      return ruleFormat(rule);
    } else {
      console.log(`Rule with rule_id : ${rule_id} not found`);
      return { error: `Rule with rule_id : ${rule_id} not found` };
    }
  } catch (error) {
    throw error
  }
};

const findLatestRuleId = async () => {
  try {
    const rule = await Rule.findOne({}, { rule_id: 1 }, { sort: { rule_id: -1 } });
    if (rule) {
      return ruleFormat(rule)
    } else {
      return false
    }
  } catch (error) {
    throw error;
  }
}

const createOrUpdateRule = async (rule_id, trigger, service) => {
  try {
    const rule = await Rule.findOne({ rule_id });
    console.log(`Creating / Updating rule`);
    
    if (rule) {
      rule.trigger = trigger;
      rule.service = service;
      const updatedRule = await rule.save();
      console.log(`Rule_id : ${rule.rule_id} already exist, updating the rule`);
      console.log(updatedRule)
      return updatedRule;
    } else {
      const newRule = new Rule({ rule_id, trigger, service });
      const savedNewRule = await newRule.save();
      console.log(`Created new rule with rule_id : ${savedNewRule.rule_id}`);
      console.log(savedNewRule)
      return savedNewRule;
    }
  } catch (error) {
    throw error;
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
      return { error: `Failed updating rule, rule with rule_id ${rule_id} not found` };
    }
  } catch (error) {
    throw error
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
        return { error: `Failed updating rule, rule with rule_id ${rule_id} not found` };
      }
  } catch (err) {
    throw error
  }
}

const deleteAllRule = async () => {
  try {
    const deletedRules = await Rule.deleteMany();
    if (deletedRules.deletedCount === 1) {
      return {
        Message: `Successfully delete all devices`,
        detail: deletedDevices,
      };
    } else {
      return { error: 'Failed deleting device, database empty, nothing to delete' };
    }
  } catch (error) {
    throw error
  }
}

module.exports = {
  findLatestRuleId,
  getAllTriggers,
  getAllRules,
  getRuleByRule_id,
  createOrUpdateRule,
  updateRule,
  deleteAllRule,
  deleteRule,
}