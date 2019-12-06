const fs = require('fs');
const md5File = require('md5-file');
const path = require("path");


module.exports.createTempDir = function() {
    if (!fs.existsSync('.temp')) {
        fs.mkdirSync('.temp');
    }
}

module.exports.getLocalPathForRemoteFile = function(remoteFile) {
    return '.temp/' + path.basename(remoteFile);
}


module.exports.saveContentToFile = function(file, content) {
    fs.writeFileSync(file, content);
}

module.exports.readFile = function(file) {
    return fs.readFileSync(file);
}

module.exports.getHash = function(file) {
    return md5File.sync(file);
}

module.exports.notifyFileChanges = function(file, handler) {
    let hash = md5File.sync(file);
    fs.watch(file, { encoding: 'utf-8' }, (eventType, filename) => {
        if (eventType == "change") {
            let newHash = md5File.sync(file);
            if (newHash != hash) {
                hash = newHash;
                handler();
            }
        }
    });
}
