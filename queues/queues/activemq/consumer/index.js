const config = require('../config'),
  rhea = require('rhea');

const init = async () => {

  rhea.on('message', function (context) {
    console.log(context.message.body);
    context.delivery.accept()
    // context.connection.close();
  });
  const connection = rhea.connect(config.connection);
  connection.open_receiver({autoaccept: false, source: config.queue});

};

module.exports = init();
