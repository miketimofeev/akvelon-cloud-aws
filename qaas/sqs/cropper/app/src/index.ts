import * as S3 from 'aws-sdk/clients/s3';
import * as SQS from 'aws-sdk/clients/sqs';
import config from './config';
import * as _ from 'lodash';
import * as sharp from 'sharp';

const init = async () => {

  const sqs = new SQS({
    apiVersion: config.sqs.apiVersion,
    region: config.sqs.region
  });

  const s3 = new S3({
    apiVersion: config.s3.apiVersion,
    region: config.s3.region
  });


  while (1) {
    const data = await sqs.receiveMessage({ QueueUrl: config.sqs.queue }).promise();

    if (!data.Messages || !data.Messages.length) {
      continue;
    }

    for (const message of data.Messages) {
      const parsed = JSON.parse(message.Body);

      const bucket = _.get(parsed, 'Records[0].s3.bucket.name');
      const object = _.get(parsed, 'Records[0].s3.object.key');

      if (!bucket || !object) {
        continue;
      }

      const file = await s3.getObject({
        Bucket: bucket,
        Key: object
      }).promise();

      const cropped = await sharp(file.Body).resize(config.resize).toBuffer();

      await s3.putObject({
        Key: object,
        Body: cropped,
        Bucket: config.s3.targetBucket
      }).promise();

      await sqs.deleteMessage({
        QueueUrl: config.sqs.queue,
        ReceiptHandle: message.ReceiptHandle
      }).promise();

      console.log(`processed file ${ object } from bucket ${ bucket } to bucket ${ config.s3.targetBucket }`);
    }
  }



};

module.exports = init().catch(e => console.log(e));
