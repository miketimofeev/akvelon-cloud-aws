const config = require('../config'),
  SQSCtrl = require('../controllers/SQSCtrl');

const init = async () => {

  const sqsCtrl = new SQSCtrl(config.connection.queue, config.connection.region, config.apiVersion);

  setInterval(async ()=>{
    await sqsCtrl.send(`super date ${Date.now()}`);
  }, 1000);


};

module.exports = init();
