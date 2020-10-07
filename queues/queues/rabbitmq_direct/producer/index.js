const config = require('../config'),
  amqp = require('amqplib');

const init = async () => {

  const connection = await amqp.connect(config.connection);
  const ch = await connection.createChannel();
  await ch.assertQueue(config.queue);
  await ch.assertExchange(config.exchange);
  await ch.bindQueue(config.queue, config.exchange);

  setInterval(() => {
    ch.publish(config.exchange, '', Buffer.from(JSON.stringify({
      ping: Date.now()
    })))
  }, 1000);

};

module.exports = init();
