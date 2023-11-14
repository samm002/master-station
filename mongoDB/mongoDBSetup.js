const mongoose = require("mongoose");
const { localHost, cloudHost } = require('./hostSetting')

const mongoDBSetup = () => {
  try {
    mongoose
      .connect(localHost)
      .then(() => console.log("Connected to MongoDB..."))
      .catch((err) => console.error("Could not connect to MongoDB...", err));
  } catch (error) {
    console.error("An unexpected error occurred during MongoDB setup:", error);
  }
}

module.exports = {
  mongoDBSetup,
}