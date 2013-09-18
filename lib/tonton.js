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
    skelePath = path.join(__dirname, '../'),
    skeleConfig = require(path.join(skelePath, 'skeleton/_tonton.json')),
    siteConfig,
    currentPath = path.resolve();

/*
 * Local Methods
 */

function confirm(msg) {
  var ok = prompt(msg);
  return (/^y|yes|ok|^$/i).test(ok.trim());
}

function setskeleConfig(key, value) {
  if (value && value.length > 0) {
    console.log('  %s set to %s', key, value);
    skeleConfig[key] = value;
    return;
  }
}

function getSiteConfig(cb) {
  fs.exists(path.resolve('./_tonton.json'), function (exists) {

    if (!exists) {
      return cb('Configuration file not found!');
    }

    var _configFile = require(path.resolve('./_tonton.json'));
    cb(null, _configFile);

  });
}

function abort() {
  console.log('\n  Aborting...'.grey);
  console.log();
  console.log('  Setup has been canceled. You may try again.');
  console.log();
}

function showError(err) {
  console.log('');
  console.log('   %s', err);
  console.log('\n   Try: %s or %s to create a new tonton site', 'tonton --help'.magenta, 'tonton new <path>'.magenta);
}

function createSkeletonAt(tp) {

  if (program.interactive) {

    console.log();
    console.log('  +-----------------------------+'.grey);
    console.log('  | Starting Interactive Setup  |'.grey);
    console.log('  +-----------------------------+'.grey);
    console.log();
    var sc = skeleConfig;
    skeleConfig.title = prompt('Title [' + sc.title.grey + ']: ') || sc.title;
    skeleConfig.subtitle = prompt('Sub-title [' + sc.subtitle.grey + ']: ') || sc.subtitle;
    skeleConfig.author = prompt('Author [' + sc.author.grey + ']: ') || sc.author;
    skeleConfig.email = prompt('Email [' + sc.email.grey + ']: ') || sc.email;
    skeleConfig.outputDir = prompt('Output directory [' + path.resolve(sc.outputDir).grey + ']: ') || path.resolve(sc.outputDir);
    console.log();
    console.log('  skeleConfiguration Data');
    console.log('  -------------------------------------'.grey);

    Object.keys(sc).forEach(function (k) {
      console.log('    %s > %s ', k.grey, sc[k].green);
    });

    console.log('  -------------------------------------'.grey);
    console.log();

    var correct = confirm('Are these details correct? Continue [Y/n]: ');

    if (!correct) {
      return abort();
    }

  }

  console.log('\n  Initializing scaffolds...'.grey);
  console.log('');
  console.log('  Extracting skeleton to %s', tp.blue);
  ncp(skelePath + '/skeleton/', tp, function (err) {

    if (err) {
      return console.log('Exraction: FAILED!');
    }
    console.log('  Extraction %s', 'DONE!'.green);

    console.log('  Writing %s to %s', '_tonton.json'.magenta, tp.blue);
    fs.writeFile(path.join(tp, '_tonton.json'), JSON.stringify(skeleConfig), function (err) {

      if (!err) {
        console.log('  Writing %s', 'DONE!'.green);
        console.log('\n  Grats! ' + 'Your site has been setup.'.grey);
        console.log();
        console.log('    cd %s && tonton serve', tp.blue);
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
  
  getSiteConfig(function (err, config) {

    if (err) {
      return showError(err);
    }

    fs.exists(path.resolve('./index.html'), function (exists) {
      if (!exists) {
        console.log('');
        console.log('  Can\'t find %s', 'index.html'.magenta);
        console.log('  Try : tonton --help'.grey);
        console.log('');
        return;
      }
      // Start the http server
    });

  });

};

exports.build = function build() {

    getSiteConfig(function (err, conf) {

      if (err) {
        return showError(err);
      }

      siteConfig = conf;

      // Setup pages
      var _pagesPath = path.join(currentPath, '_pages');
      var _pages  = fs.readdirSync(_pagesPath);
      siteConfig.pageNum = _pages.length; // Total number of pages
      _pages.forEach(function (p) {
        var page = {};
        page.title = p.split('.')[0];
      });
      console.log(siteConfig);

    });

  };

// TODO
