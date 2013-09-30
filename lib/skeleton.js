'use strict';
var path = require('path'),
		eol = require('os').platform() === 'win32' ? '\r\n' : '\n';

/**
* Default Configuration File
* @output _tonton.json
**/
var config = exports.config = {};
config.title = 'My Site';
config.slogan = 'Some awesome website';
config.author = 'Elizar Pepino';
config.email = 'hello@elizarpepino.com';
config.outputDir = 'public';
config.theme = 'oink';

/**
* First Post Template
*/
exports.firstPost = [
	'---',
	'title : "First Post Nyay!!!"',
	'date  : 2013-09-18 04:59:10',
	'category : blog',
	'tags : nice first post',
	'---',
	'',
	'**Initial Post**. Make sure you edit this or you can add a new post by',
	'creating a ***markdown*** file under the `_post` dir. Make sure you follow the',
	'naming convention as well. Also, on top of your every post there\'s a',
	'meta data that gives `tonton` the information it needs to render your',
	'post.',
	'',
	'### For lazy folks',
	'',
	'You can do `$ tonton post <newly-written.md> file`. Pretty slick right?',
	'',
	'### Credits:',
	'',
	'[Elizar Pepino](http://elizarpepino.com) - maintainer',
	'',
	'Ciao!'
].join(eol);

exports.indexPage = [
	'#Hello There!',
	'',
	'##My name is **Elizar Pepino** and I\'m a web craftsman. I build awesome stuffs on the web and mobile platforms. I am currently working as a senior Software Engineer at Global Zeal, a School Improvement Network Company based in Cebu City, Philippines.',
	''
].join(eol);

exports.aboutPage = [
	'#About Me',
	'',
	'Lorem ipsum Ea aliqua in est ut ut quis dolore ut fugiat magna cupidatat laborum est esse occaecat sed sunt dolore.'
].join(eol);
