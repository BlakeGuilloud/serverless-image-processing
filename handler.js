'use strict';

const AWS = require('aws-sdk');
const S3 = new AWS.S3();

module.exports.uploadFile = (event, context, callback) => {
  const { fileName, fileData, fileType } = JSON.parse(event.body);

  const formattedFile = fileData.replace(/^data:image\/\w+;base64,/, '');
  const buf = new Buffer(formattedFile, 'base64');

  const data = {
    Bucket: 'sls-demos-bucket-102', // This will be an env variable for the proper bucket
    Key: fileName,
    Body: buf,
    ContentEncoding: 'base64',
    ContentType: fileType,
  };

  S3.putObject(data, (err, data) => {
    if (err) {
      console.log(err);
      console.log('Error uploading data: ', data);
    } else {
      console.log('Image was uploaded successfully!!!');
    }
  });

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Here\'s a sample image. process it and stuff..',
      file: event,
    }),
  };

  callback(null, response);
};

module.exports.processImage = (event, context, callback) => {
  event.Records.forEach((record) => {
    const filename = record.s3.object.key;
    const filesize = record.s3.object.size;

    console.log(`New bucket object has been created: ${filename} (${filesize} bytes)`);
  });

  const response = {
    statusCode: 200,
    body: JSON.stringify({ message: 'Bucket object has been created!', body: event.Records }),
  };

  callback(null, response);
}