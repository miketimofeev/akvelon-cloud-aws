const config = require('../config'),
  rhea = require('rhea');

const init = async () => {

  const connection = rhea.connect(config.connection);
  connection.open_sender(config.queue);

  const ctx = await new Promise(res =>
    rhea.once('sendable', res)
  );

  setInterval(() => {
    ctx.sender.send({
      body: JSON.stringify({
        ping: Date.now()
      })
    });
  }, 1000);

};

module.exports = init();
