const {EventEmitter} = require('events'),
  AWS = require('aws-sdk');

class SQSCtrl extends EventEmitter {

  constructor (queue, region, apiVersion) {
    super();
    this.sqs = new AWS.SQS({apiVersion: apiVersion, region: region});
    this.queue = queue;
  }

  subscribe () {

    try {
      this.subscribed = true;
      this._checkMessage();
    } catch (e) {
      this.emit('error', e);
    }

  }

  unsubscribe () {
    this.subscribed = false;

  }

  async _checkMessage () {

    const params = {
      MaxNumberOfMessages: 10,
      QueueUrl: this.queue,
      VisibilityTimeout: 20,
      WaitTimeSeconds: 10
    };

    const data = await new Promise((res, rej) => {
      this.sqs.receiveMessage(params, (err, data) => err ? rej(err) : res(data))
    });

    if(data.Messages)
    for(const item of data.Messages){

      const ack = async (id) => {
        const deleteParams = {
          QueueUrl: this.queue,
          ReceiptHandle: id
        };

        await new Promise((res, rej) => {
          this.sqs.deleteMessage(deleteParams, (err, data) => err ? rej(err) : res(data)
          );
        });
      };

      if (data.Messages)
        this.emit('data', {message: item.Body, ack: ack.bind(this, item.ReceiptHandle)});


    }


    if (this.subscribed)
      return this._checkMessage()
  }

  async send (message) {

    const params = {
      DelaySeconds: 10,
      MessageBody: message,
      QueueUrl: this.queue
    };

    await new Promise((res, rej) =>
      this.sqs.sendMessage(params, (err, data) => err ? rej(err) : res(data))
    );
  }

}

module.exports = SQSCtrl;