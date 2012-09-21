#!/usr/bin/env node

/**
 * Module dependencies.
 */

var program = require('commander')
  , connect = require('connect')
  , custom = require('../')
  , fs = require('fs')
  , app = connect()

program
  .version(JSON.parse(fs.readFileSync(__dirname + '/../package.json', 'utf8')).version)
  .option('-p --port [8080]', 'Port to use (default :8080).', 8080)
  .option('-s --silent', 'Do not show log messages.')
  .option('-t --toc', 'Add Table of Contents to html.')

program.name = 'md-server';

program.parse(process.argv);

var root = program.args[0] || './';

if (program.port) {
  var port = parseInt(program.port, 10);
};

if (!program.silent) {
  app.use(connect.logger('dev'));
};

if (program.toc) {
	app.use(custom.markdown(root, true));
} else {
	app.use(custom.markdown(root));
};

app.use(connect.static(root));
app.use(connect.directory(root));

app.listen(port);

console.log('Serving %s on port: %d', root, port);

