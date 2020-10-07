require('dotenv').config();

module.exports = {
  connection: {
    hosts: process.env.HOSTS || 'localhost:9092',
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    authType: process.env.AUTH_TYPE || 'PLAINTEXT'
  },
  queue: process.env.QUEUE || 'example'

};