const AWS = require('aws-sdk');
const { exec, spawn } = require('child_process');
var path = require("path");
const fs = require('fs');
const md5File = require('md5-file');

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const s3 = new AWS.S3({});
const bucketName = process.argv[2];
const file = process.argv[3];
const editor = process.argv[4] ? process.argv[4] : 'nano';
const localFile = '.temp/' + path.basename(file);
let localMd5Hash = '';
let isUploading = false;


if (!fs.existsSync('.temp')) {
    fs.mkdirSync('.temp');
}


function uploadLocalFileToS3() {
    if (isUploading) {
        return
    }
    console.log(file, "start syncing");
    isUploading = true;
    const fileContentToUpload = fs.readFileSync(localFile);
    const params = {
        Bucket: bucketName,
        Key: file, 
        Body: fileContentToUpload
    };
    s3.upload(params, function (err, data) {
        isUploading = false;
        if (err) {
            console.error("fail to upload file");
        }
        console.log(file, "synced success");
    });
}

(async () => {
    // Download file from s3
    console.log("reading file ", file, "to", localFile);
    let s3GetParam = { Bucket: bucketName, Key: file };
    let fileContent = await s3.getObject(s3GetParam).promise();
    fileContent = fileContent.Body.toString('utf-8')
    fs.writeFileSync(localFile, fileContent);
    // calculate md5 hash to watch file changes
    localMd5Hash = md5File.sync(localFile);
    console.log("file reading success");
    console.log("opening file");
    // open editor
    await exec(editor + ' ' + localFile);
    spawn(editor, [localFile], {
        stdio: 'inherit',
        detached: true
    });
    fs.watch(localFile, { encoding: 'utf-8' }, (eventType, filename) => {
        if (eventType == "change") {
            let newMd5 = md5File.sync(localFile);
            if (newMd5 != localMd5Hash) {
                localMd5Hash = newMd5;
                uploadLocalFileToS3();
            }
        }
    });
})();
