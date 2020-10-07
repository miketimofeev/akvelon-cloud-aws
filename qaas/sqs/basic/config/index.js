require('dotenv').config();

module.exports = {
  connection: {
    queue: process.env.QUEUE,
    region: process.env.REGION
  },
  apiVersion: process.env.API_VERSION
};