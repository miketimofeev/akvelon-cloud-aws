require('dotenv').config();

export default {
  sqs: {
    queue: process.env.SQS_QUEUE,
    region: process.env.SQS_REGION,
    apiVersion: process.env.SQS_API_VERSION
  },
  s3: {
    targetBucket: process.env.S3_TARGET_BUCKET,
    region: process.env.S3_REGION,
    apiVersion: process.env.S3_API_VERSION
  },
  resize: process.env.RESIZE ? parseInt(process.env.RESIZE, 10) : 200
};
