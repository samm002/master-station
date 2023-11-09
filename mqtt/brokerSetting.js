// Configuration for local mosquitto broker
const local = {
  host: "localhost",
  port: "1883",
  protocol: "mqtt",
  clientId: "fba93eca-a442-4369-97e4-2ab7b810519d",
  clean: true,
};

// Configuration for online broker HiveMQ
const cool = {
  host: 'broker.mqtt.cool',
  port: 1883,
  protocol: 'mqtt',
  // username: 'samm002',
  // clientId: "clientId-YDFpPL35p5",
  // password: `${process.env.MQTT_BROKER_PASSWORD}`
}

const emqx = {
  host: 'broker.emqx.io',
  port: 1883,
  protocol: 'mqtt',
}

module.exports = {
  local,
  cool,
  emqx,
}