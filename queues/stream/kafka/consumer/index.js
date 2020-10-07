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


  const consumer = kafka.consumer({groupId: 'test-group'});

  await consumer.connect();
  await consumer.subscribe({topic: 'topic1'});

  await consumer.run({
    eachMessage: async ({topic, partition, message}) => {
      const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`
      console.log(`- ${prefix} ${message.key}#${message.value}`)
    }
  })


};

module.exports = init();
