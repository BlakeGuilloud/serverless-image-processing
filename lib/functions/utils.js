const AWS = require('aws-sdk');
const S3 = new AWS.S3();

module.exports = {
  getBucketData,
  getObject,
  putObject,
};

function getObject(params = {}) {
  return S3.getObject(params).promise();
}

function putObject(params = {}) {
  return S3.putObject(params).promise();
}

function getBucketData(Key, Body, ContentType = 'image/jpeg', ContentEncoding = 'base64', Bucket = 'sls-demos-bucket-103', ) {
  return {
    Body,
    Bucket,
    ContentEncoding,
    ContentType,
    Key,
  };
}
