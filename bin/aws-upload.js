'use strict';

require('dotenv').load();

const fs = require('fs');

const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const mime = require('mime');
const path = require('path');

let file = {
  path: process.argv[2],
  title: process.argv[3]
};

let stream = fs.createReadStream(file.path);
let bucket = process.env.AWS_S3_BUCKET_NAME;
let contentType = mime.lookup(file.path);
let ext = path.extname(file.path);
let folder = new Date().toISOString().split('T')[0];

const params = {
  ACL: 'public-read',
  Bucket: bucket,
  Key: folder + '/' + file.title + ext,
  // can also write it using string interpolation (below)
  // Key: `${folder}/${file.title}${ext}`
  Body: stream,
  ContentType: contentType,
};

s3.upload(params, function(err, data) {
  if (err) {
    console.log(err);
  }
  console.log(data);
});
