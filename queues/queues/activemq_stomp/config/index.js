require('dotenv').config();

module.exports = {
  connection: {
    host: process.env.HOST || 'localhost',
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 5672,
    username: process.env.USERNAME,
    password: process.env.PASSWORD
  },
  queue: process.env.QUEUE || 'example'

};