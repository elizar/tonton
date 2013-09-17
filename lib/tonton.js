'use strict';
/*
 * Module Dependencies
 */
var prompt = require('sync-prompt').prompt,
    ncp = require('ncp').ncp,
    path = require('path'),
    colors = require('colors'),
    eol = require('os').platform() === 'win32' ? '\r\n' : '\n',
    fs = require('fs'),
    program = require('commander'),
    tontonPath = path.join(__dirname, '../'),
    config = require(path.join(tontonPath, 'skeleton/_tonton.json')),
    currentPath = path.resolve();

/*
 * Local Methods
 */

function confirm(msg) {
  var ok = prompt(msg);
  return (/^y|yes|ok|^$/i).test(ok.trim());
}

function setConfig(key, value) {
  if (value && value.length > 0) {
    console.log('  %s set to %s', key, value);
    config[key] = value;
    return;
  }
}

function abort() {
  console.log();
  console.log('\n  Aborting...');
  console.log('  Setup has been canceled. You may try again.');
  console.log();
}

function createSkeletonAt(tp) {

  if (program.interactive) {
    console.log();
    console.log('  +-----------------------------+'.grey);
    console.log('  | Starting Interactive Setup  |'.grey);
    console.log('  +-----------------------------+'.grey);
    console.log();
    config.title = prompt('Title [TonTon]:'.grey + ' ') || config.title;
    config.subtitle = prompt('Sub-title [oink oink]:'.grey + ' ') || config.subtitle;
    config.author = prompt('Author [Elizar Pepino]:'.grey + ' ') || config.author;
    config.email = prompt('Email [hello@elizarpepino.com]:'.grey + ' ') || config.email;
    config.outputDir = prompt('Output directory [current dir]:'.grey + ' ') || path.resolve(config.outputDir);
    console.log();
    console.log('  Configuration Data');
    console.log('  -------------------------------------'.grey);
    for (var k in config) {
      console.log('    %s > %s ', k.grey, config[k].green);
    }
    console.log('  -------------------------------------'.grey);
    console.log();

    var correct = confirm('Are these details correct? Continue [Y/n]: ');

    if (!correct) {
      return abort();
    }

  }

  console.log('\n  Initializing scafolds...'.grey);
  console.log('');
  console.log('  Extracting skeleton to %s', tp.split('/').pop().blue.bold);
  ncp(tontonPath + '/skeleton/', tp, function (err) {

    if (err) {
      return console.log('Exraction: FAILED!');
    }
    console.log('  Extraction %s', 'DONE!'.green);

    console.log('  Writing %s to %s', '_tonton.json'.magenta, tp.split('/').pop().blue.bold);
    fs.writeFile(path.join(tp, '_tonton.json'), JSON.stringify(config), function (err) {

      if (!err) {
        console.log('  Writing %s', 'DONE!'.green);
        console.log('\n  Nice! Your site has been setup. Now do:'.green);
        console.log();
        console.log('    cd %s && tonton serve'.grey, tp.split('/').pop());
        console.log();
      }
      else {
        console.log('  Error'.red + ' : ' + err.toString());
        return abort();
      }

    });

  });
}

function tonton(tp) {

  if (!tp) {
    var ok = confirm('No path specified, use current DIR instead? [Y/n]: ');
    if (ok) {
      createSkeletonAt(currentPath);
    }
    else {
      abort();
    }
  }

  else {
    createSkeletonAt(path.resolve(tp));
  }

}

var exports = module.exports = tonton;

/**
 * Public Methods
 * */

exports.serve = function serve(port) {
  var _port = port || 4000;
};
