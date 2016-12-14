'use strict';

require('dotenv').load();

const fs = require('fs');

const AWS = require('aws-sdk');
const s3 = new AWS.S3();

let file = {
  path: process.argv[2],
  title: process.argv[3]
};

console.log("file is", file);

let stream = fs.createReadStream(file.path);
let bucket = process.env.AWS_S3_BUCKET_NAME;

const params = {
  ACL: 'public-read',
  Bucket: bucket,
  Key: file.title,
  Body: stream,
};

s3.upload(params, function(err, data) {
  if (err) {
    console.log(err);
  }
  console.log(data);
});
