'use strict';

const fs = require('fs');

const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const mime = require('mime');
const path = require('path');
const crypto = require('crypto');

const s3Upload = function(file) {
  let stream = fs.createReadStream(file.path);
  let bucket = process.env.AWS_S3_BUCKET_NAME;
  let contentType = mime.lookup(file.path);
  let ext = path.extname(file.path);
  let folder = new Date().toISOString().split('T')[0];

  return new Promise(function(resolve, reject){
    crypto.randomBytes(16, function(error, buffer){
      if (error) {
        reject(error);
      } else {
        resolve(buffer.toString('hex'));
      }
    });
  })
  .then(function(filename){
    const params = {
      ACL: 'public-read',
      Bucket: bucket,
      Key: folder + '/' + filename + ext,
      // Key: folder + '/' + file.title + ext,
      // can also write it using string interpolation (below)
      // Key: `${folder}/${file.title}${ext}`
      Body: stream,
      ContentType: contentType,
    };

    return new Promise(function(resolve, reject){
      s3.upload(params, function(err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  });
};

// just exports what you tell it to
// below only exports one function so we can call it without dot notation in the other script
// if we were exporting multiple things we'd put it in an object and need to use dot notation
module.exports = s3Upload;
