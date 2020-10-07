const config = require('../config'),
  {Kafka} = require('kafkajs');

const init = async () => {

  const options = {
    clientId: 'my-app',
    brokers: config.connection.hosts.split(',')
  };

  if (config.connection.username && config.connection.password) {
    Object.assign(options, {
      sasl: {
        username: config.connection.username,
        password: config.connection.password,
        mechanism: config.connection.authType
      }
    })
  }

  const kafka = new Kafka(options);


  const producer = kafka.producer();

  await producer.connect();


  setInterval(async () => {

    const message = {
      key: 'timestamp',
      value: Date.now().toString(),
      partition: 0
    };

    await producer.send({
      topic: 'topic1',
      messages: [message]
    });

  }, 3000);


};

module.exports = init();
