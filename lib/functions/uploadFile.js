const { tryParse } = require('serverless-helpers/responses');
const { putObject } = require('./utils');

module.exports.handler = (event, context, callback) => {
  const { fileName, fileData, fileType } = tryParse(event.body);

  const formattedFile = fileData.replace(/^data:image\/\w+;base64,/, '');
  const buf = new Buffer(formattedFile, 'base64');

  const data = {
    Bucket: 'sls-demos-bucket-103', // This will be an env variable for the proper bucket
    Key: fileName,
    Body: buf,
    ContentEncoding: 'base64',
    ContentType: fileType,
  };

  putObject(data);

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Here\'s a sample image. process it and stuff..',
      file: event,
    }),
    headers: {
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
  };

  callback(null, response);
};