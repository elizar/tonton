'use strict';
/*
 * Module Dependencies
 */
var prompt = require('sync-prompt').prompt,
    ncp = require('ncp').ncp,
    mkdirp = require('mkdirp'),
    path = require('path'),
    colors = require('colors'),
    fs = require('fs'),
    fork = require('child_process').fork,
    program = require('commander'),
    siteConfig,
    currentPath = path.resolve(),
    skeleton = require(path.join(__dirname, './skeleton'));

/*
 * Local Methods
 */

function confirm(msg) {
  var ok = prompt(msg);
  return (/^y|yes|ok|^$/i).test(ok.trim());
}

function isEmpty(path) {
  var exists = fs.existsSync(path);
  if (!exists) {
    return true;
  }
  var list = fs.readdirSync(path);
  return list.length > 0 ? false : true;
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

function abort(msg) {
  console.log('\n  Aborting...'.grey);
  console.log('  --'.grey);
  if (msg && msg.trim() !== '') {
    console.log();
    console.log('  ' + msg.yellow);
    console.log();
    console.log('  Try the following commands:');
    console.log('    $ tonton --help'.magenta);
    console.log('    $ tonton new <path>'.magenta);
    console.log();
    console.log('  --'.grey);
  } else {
    console.log('  Setup has been canceled. You may try again.'.yellow);
    console.log();
  }
  process.exit();
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
    var sc = skeleton.config;
    sc.title = prompt('Title [' + sc.title.grey + ']: ') || sc.title;
    sc.subtitle = prompt('Sub-title [' + sc.subtitle.grey + ']: ') || sc.subtitle;
    sc.author = prompt('Author [' + sc.author.grey + ']: ') || sc.author;
    sc.email = prompt('Email [' + sc.email.grey + ']: ') || sc.email;
    sc.outputDir = prompt('Output directory [' + tp + ']: ') || path.resolve(tp);
    console.log();
    console.log('  %s data', ' _tonton.json'.magenta);
    console.log('  -------------------------------------'.grey);
    console.log('  {');
    Object.keys(sc).forEach(function (k) {
      console.log('   \'%s\' : \'%s\' ', k.grey, sc[k].green);
    });
    console.log('  }');
    console.log('  -------------------------------------'.grey);
    console.log();

    var correct = confirm('Are these details correct? Continue [Y/n]: ');
    if (!correct) {
      abort();
    }

  }

  var emptyDir = isEmpty(tp);
  if (!emptyDir) {
    abort(tp + ' is not an empty directory');
  }

  console.log('\n  Initializing scaffolds...'.grey);
  var directories = {
      pages : path.join(currentPath, '_pages'),
      posts : path.join(currentPath, '_posts'),
      themes : path.join(currentPath, '_themes')
    };

  for (var dirName in directories) {
    console.log('');
    console.log('  Creating directory: %s', directories[dirName].blue);
    if (!mkdirp.sync(directories[dirName])) {
      return abort('  Error creating directory!');
    }
    console.log('  Done!'.green);
  }

  // extract _theme
  console.log('  Extracting default theme to %s', directories.themes.blue);
  ncp(path.join(__dirname, '../default_theme/'), directories.themes, function (err) {

    if (err) {
      return console.log('Exraction: FAILED!');
    }
    console.log('  Extraction %s', 'DONE!'.green);

    console.log('  Writing %s to %s', '_tonton.json'.magenta, tp.blue);
    fs.writeFile(path.join(tp, '_tonton.json'), JSON.stringify(skeleton.config), function (err) {

      if (!err) {
        console.log('  Writing %s', 'DONE!'.green);
        console.log('\n  Grats! ' + 'Your site has been setup.'.grey);
        console.log();
        console.log('    cd %s && tonton serve', tp.blue);
        console.log();
      } else {
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
    } else {
      abort();
    }
  } else {
    createSkeletonAt(path.resolve(tp));
  }

}

var exports = module.exports = tonton;

/*
 * Public Methods
 */

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
    var _pages = fs.readdirSync(_pagesPath);
    siteConfig.pageNum = _pages.length; // Total number of pages
    _pages.forEach(function (p) {
      var page = {};
      page.title = p.split('.')[0];
    });
    console.log(siteConfig);

  });

};

// TODO
