const dotenv = require("dotenv");

dotenv.config();

const port = process.env.PORT;
const mongo_username = process.env.MONGO_USERNAME;
const mongo_password = process.env.MONGO_PASSWORD;

const config = {
  port,
  mongo_username,
  mongo_password,
};

module.exports = config
