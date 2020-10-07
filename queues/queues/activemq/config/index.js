require('dotenv').config();

module.exports = {
  connection: {
    host: process.env.QUEUE_HOST || 'localhost',
    port: process.env.QUEUE_PORT ? parseInt(process.env.QUEUE_PORT, 10) : 5672,
    username: process.env.QUEUE_USERNAME,
    password: process.env.QUEUE_PASSWORD,
    transport: process.env.QUEUE_TRANSPORT
  },
  queue: process.env.QUEUE || 'example'

};