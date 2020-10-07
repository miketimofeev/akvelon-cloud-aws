const config = require('../config'),
  stompit = require('stompit');

const init = async () => {

  const connectOptions = {
    host: config.connection.host,
    port: config.connection.port,
    connectHeaders: {
      host: '/',
      login: config.connection.username,
      passcode: config.connection.password,
      'heart-beat': '5000,5000'
    }
  };

  const client = await new Promise((res, rej) =>
    stompit.connect(connectOptions, (error, client) => error ? rej(error) : res(client)
    )
  );

    const subscribeHeaders = {
      destination: `/queue/${config.queue}`,
      ack: 'client-individual'
    };

    client.subscribe(subscribeHeaders, function (error, message) {

      message.readString(undefined, function (error, body) {

        if (error) {
          console.log('read message error ' + error.message);
          return;
        }

        console.log('received message: ' + body);

        client.ack(message);

        // client.disconnect();
      });
    });


};

module.exports = init();
