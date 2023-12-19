// Configuration for local broker mosquitto
const local = {
  host: "localhost",
  port: "1883",
  protocol: "mqtt",
  clientId: "fba93eca-a442-4369-97e4-2ab7b810519d",
  clean: true,
};

// Configuration for online broke cool
const cool = {
  clean: true,
  host: "broker.mqtt.cool",
  port: "1883",
  protocol: "mqtt",
  clientId: "c8996a3a-f7eb-438d-96c2-70b1e07308f8",
};

const emqx = {
  host: "broker.emqx.io",
  port: 1883,
  protocol: "mqtt",
  clean: true,
};

module.exports = {
  local,
  cool,
  emqx,
};
