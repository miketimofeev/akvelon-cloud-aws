const config = require('../config'),
  SQSCtrl = require('../controllers/SQSCtrl');

const init = async () => {

  const sqsCtrl = new SQSCtrl(config.connection.queue, config.connection.region, config.apiVersion);

  sqsCtrl.subscribe();

  sqsCtrl.on('data', async data=>{
    console.log(data.message);
    await data.ack();
  })




};

module.exports = init();
