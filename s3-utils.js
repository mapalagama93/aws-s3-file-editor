const AWS = require('aws-sdk');
const fs = require('fs');
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});
const s3 = new AWS.S3({});

module.exports.getObjectAsString = async function(bucketName, file) {
    let s3GetParam = { Bucket: bucketName, Key: file };
    let data = await s3.getObject(s3GetParam).promise();
    console.log('file downloaded', bucketName, file);
    return data.Body.toString('utf-8');
}

module.exports.uploadObject = async function(bucketName, file, fileContent) {
    const params = {
        Bucket: bucketName,
        Key: file, 
        Body: fileContent
    };
    let data = s3.upload(params).promise();
    console.log('file uploaded', bucketName, file);
    return data;
}