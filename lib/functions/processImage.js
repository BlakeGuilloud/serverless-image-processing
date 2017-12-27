const sharp = require('sharp');
const { getBucketData, getObject, putObject } = require('./utils');

module.exports.handler = (event, context, callback) => {
  event.Records.forEach((record) => {
    const filename = record.s3.object.key;
    const filesize = record.s3.object.size;

    let fileType = '';

    getObject({ Key: filename, Bucket: 'sls-demos-bucket-103' })
      .then((data) => {
        fileType = data.ContentType;

        return sharp(data.Body)
          .resize(200)
          .toBuffer();
      })
      .then((buf) => {
        const minKey = filename.split('.').join('.min.');
        const data = getBucketData(minKey, buf, fileType);

        putObject(data);
      });

    console.log(`New bucket object has been created: ${record} bytes)`); // eslint-disable-line no-console
  });

  const response = {
    statusCode: 200,
    body: JSON.stringify({ message: 'Bucket object has been created!', body: event.Records }),
  };

  callback(null, response);
};