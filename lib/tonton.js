'use strict';
/*
 * Module Dependencies
 */
var prompt = require('co-prompt'),
    confirm = prompt.confirm,
    path = require('path'),
    eol = require('os').platform() === 'win32' ? '\r\n' : '\n',
    fs = require('fs'),
    currentDir = path.resolve();

/*
 * Local Methods
 */

function _confirm(msg, cb) {
  confirm(msg)(cb);
}

function _prompt(msg, cb) {
  prompt(msg)(cb);
}

function _createSkeletonAt(tp) {
  console.log('\n  Initializing scafolds...');
  console.log('  Extracting skeleton to %s', tp);
  console.log('  Extraction: DONE!');
}

function tonton(tp) {
  // TODO

  if (!tp) {
    _confirm('No path specified, use current DIR instead? [y/N] ', function (err, ok) {
      if (ok) {
        _createSkeletonAt(currentDir);
      }
      else {
        console.log('\n  Aborting...');
        console.log('  Setup has been canceled. You may try again.');
      }
      return process.stdin.destroy();
    });
  }

  else {
    _createSkeletonAt(path.resolve(tp));
  }

}

var exports = module.exports = tonton;

exports.serve = function serve(port) {
  var _port = port || 4000;
};

