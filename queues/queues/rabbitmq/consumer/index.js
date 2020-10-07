const config = require('../config'),
  amqp = require('amqplib');

const init = async () => {

  const connection = await amqp.connect(config.connection);
  const ch = await connection.createChannel();
  await ch.assertQueue(config.queue);

  ch.consume(config.queue, msg => {
    console.log(msg.content.toString());
    ch.ack(msg);
  });

};

module.exports = init();
