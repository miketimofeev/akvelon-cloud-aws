const config = require('../config'),
  amqp = require('amqplib');

const init = async () => {

  const connection = await amqp.connect(config.connection);
  const ch = await connection.createChannel();
  // await ch.assertQueue(config.queue);
  // await ch.assertExchange(config.exchange);
 // await ch.bindQueue(config.queue, config.exchange);

  ch.consume(config.queue, msg => {
    console.log(msg.content.toString());
    ch.ack(msg);
  });

};

module.exports = init();
