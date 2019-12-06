#!/usr/bin/env node
const fileUtils = require('./file-utils');
const s3Utils = require('./s3-utils');
const editorUtils = require('./editor-utils');
const helpUtils = require('./help-utils');

if(process.argv[2] == 'help') {
    helpUtils.showHelp();
    return;
}

const bucketName = process.argv[2];
const file = process.argv[3];
const editor = process.argv[4] ? process.argv[4] : 'nano';
const localFile = fileUtils.getLocalPathForRemoteFile(file);
var localFileHash = null;
fileUtils.createTempDir();

(async () => {
    let fileContent = await s3Utils.getObjectAsString(bucketName, file);

    fileUtils.saveContentToFile(localFile, fileContent);

    localFileHash = fileUtils.getHash(localFile);

    editorUtils.openFileWithEditor(localFile, editor);

    fileUtils.notifyFileChanges(localFile, () => {
        let fileContent = fileUtils.readFile(localFile);
        s3Utils.uploadObject(bucketName, file, fileContent);
    });

})();