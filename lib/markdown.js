
/*!
 */

/**
 * Module dependencies.
 */

var marked = require('marked')
  , fs = require('fs')
  , parse = require('url').parse
  , path = require('path')
  , normalize = path.normalize
  , extname = path.extname
  , join = path.join;

/**
 * Markdown:
 *
 *   Render markedown file as html.
 *
 * Examples:
 *
 *     connect()
 *       .use(custom.markdown('public'))
 *
 * Options:
 *
 *    - `maxAge`     Browser cache maxAge in milliseconds. defaults to 0
 *
 * @param {String} root
 * @param {Boolean} addtoc
 * @param {Object} options
 * @return {Function}
 * @api public
 */

exports = module.exports = function markedown(root, addtoc, options){
  options = options || {};

  // root required
  if (!root) throw new Error('markdown() root path required');

  // default redirect
  // var redirect = false === options.redirect ? false : true;

  // read html template
  var html;
  fs.readFile(__dirname + '/../static/md.html', 'utf8', function(err, data) {
    if (err) throw err;
    html = data;
  });

  return function markedown(req, res, next) {
    if ('GET' != req.method && 'HEAD' != req.method) return next();
    // var path = parse(req).pathname;

    var url = parse(req.url)
      , dir = decodeURIComponent(url.pathname)
      , path = normalize(join(root, dir))

    if (!ismd(path)) return next();

    // read markdown
    fs.readFile(path, 'utf8', function(err, str){
      if (err) return next(err);
      if (addtoc) {
        var tocs = toc(str);
        if (0 < tocs.length) {
          tocs = '<div id="toc">\n\n'
               + marked(tocs.join('\n'))
               + '\n</div>\n\n';
          str = tocs + str;
        };
      };
      fs.readFile(__dirname + '/../static/index.css', 'utf8', function(err, style) {
        if (err) return next(err);
        str = marked(str);
        str = html
          .replace('{title}', basename(path))
          .replace('{title}', basename(path))
          .replace('{style}', style)
          .replace('{content}', str)
        res.setHeader('Content-Type', 'text/html');
        res.setHeader('Content-Length', Buffer.byteLength(str, 'utf8'));
        res.end(str);
      });
    });
  };
};

function ismd(path) {
  path = extname(path)
  return path == '.md'
      || path == '.mkd'
      || path == '.markdown'
};

function basename(str) {
  str = String(str);
  return str.slice(str.lastIndexOf('/') + 1)
};

/*
 * Create Table of Contents. Only truns markdown
 * listings.
 *
 * Example:
 *
 *   # foo
 *   ## bar
 *
 *   =>
 *   * foo
 *     * bar
 *
 * @param {String} str
 * @return {Array}
 */

function toc (str) {
  if (typeof str != 'string') return [];

  var heads = []
    , prev = ''

  str.split('\n').forEach(function (d) {
    if (d.indexOf('#') == 0) heads.push(d);
    if (prev != '' && d.indexOf('===') == 0) heads.push('# ' + prev);
    if (prev != '' && d.indexOf('---') == 0) heads.push('## ' + prev);
    prev = d;
  });

  return heads.map(function (d) {
    d = d.replace('# ', '* ');
    while (~d.indexOf('#')) {
      d = d.replace('#', '  ');
    };
    return d;
  });
}
