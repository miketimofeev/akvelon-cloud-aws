const config = require('../config'),
  amqp = require('amqplib');

const init = async () => {

  const connection = await amqp.connect(config.connection);
  const ch = await connection.createChannel();
  await ch.assertQueue(config.queue);

  setInterval(() => {
    ch.sendToQueue(config.queue, Buffer.from(JSON.stringify({
      ping: Date.now()
    })))
  }, 1000);

};

module.exports = init();
