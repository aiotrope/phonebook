/* eslint-disable no-undef */
const dotenv = require('dotenv')

dotenv.config()

// eslint-disable-next-line no-undef
const port = process.env.PORT
const mongo_username = process.env.MONGO_USERNAME
const mongo_password = process.env.MONGO_PASSWORD
const mongo_url = process.env.MONGO_URL

const config = {
  port,
  mongo_username,
  mongo_password,
  mongo_url
}

module.exports = config
