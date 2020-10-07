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


  const sendHeaders = {
    'destination': `/queue/${config.queue}`,
    'content-type': 'text/plain'
  };


  setInterval(() => {
    const frame = client.send(sendHeaders);
    frame.write(JSON.stringify({
        ping: Date.now()
      })
    );
    frame.end();
  }, 1000);

};

module.exports = init();
