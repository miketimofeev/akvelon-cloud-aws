require('dotenv').config();

module.exports = {
  connection: {
    uri: process.env.CONNECTION_URI || 'amqp://guest:guest@localhost:5672'
  },
  queue: process.env.QUEUE || 'example'

};