const { exec, spawn } = require('child_process');

module.exports.openFileWithEditor = function(file, editor) {
    spawn(editor, [file], {
        stdio: 'inherit',
        detached: true
    });
}