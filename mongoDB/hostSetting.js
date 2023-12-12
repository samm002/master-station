const databaseName = "master-station";
const localHost = `${process.env.MONGO_LOCAL}/${databaseName}`;
const cloudHost = process.env.MONGO_URI;

module.exports = {
  localHost,
  cloudHost,
};
