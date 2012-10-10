
/*!
 */

/**
 * Module dependencies.
 */

var marked = require('marked')
  , fs = require('fs')
  , parse = require('url').parse
  , path = require('path')

/**
 * Markdown:
 *
 *   Render markdown file as html.
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

exports = module.exports = function markdown(root, addtoc, options){
  options = options || {};

  // root required
  if (!root) throw new Error('markdown() root path required');

  // default redirect
  // var redirect = false === options.redirect ? false : true;

  // read html template and css
  var template, style;

  fs.readFile(__dirname + '/../static/md.html', 'utf8', function(err, data) {
    if (err) throw err;
    template = data;
  });

  fs.readFile(__dirname + '/../static/index.css', 'utf8', function(err, data) {
    // if (err) return next(err);
    if (err) throw err;
    style = data;
  });

  return function markdown(req, res, next) {
    if ('GET' != req.method && 'HEAD' != req.method) return next();
    // var path = parse(req).pathname;

    var url = parse(req.url)
      , dir = decodeURIComponent(url.pathname)
      , fullpath = path.normalize(path.join(root, dir))

    if (!ismd(fullpath)) return next();

    // read markdown
    fs.readFile(fullpath, 'utf8', function(err, str){
      if (err) return next(err);
      // var dir = 
      if (addtoc) {
        var lexed = marked.lexer(str);
        return buildToc(lexed, path.basename(fullpath, '.md'), function(err, toc) {
          if (err) return next(err);
          str = template
            .replace('{title}', dir)
            .replace('{title}', dir)
            .replace('{style}', style)
            .replace('{content}', marked.parser(lexed))
            .replace('{toc}', toc)
          res.setHeader('Content-Type', 'text/html');
          res.setHeader('Content-Length', Buffer.byteLength(str, 'utf8'));
          res.end(str);
        });
      };
      str = template
        .replace('{title}', dir)
        .replace('{title}', dir)
        .replace('{style}', style)
        .replace('{content}', marked(str))
        .replace('{toc}', '')
      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Content-Length', Buffer.byteLength(str, 'utf8'));
      res.end(str);
    });
  };
};

function ismd(str) {
  str = path.extname(str)
  return str == '.md'
      || str == '.mkd'
      || str == '.markdown'
};

function buildToc(lexed, filename, cb) {
  var indent = 0;
  var toc = [];
  var depth = 0;
  lexed.forEach(function(tok) {
    if (tok.type !== 'heading') return;
    if (tok.depth - depth > 1) {
      return cb(new Error('Inappropriate heading level\n' +
                          JSON.stringify(tok)));
    }

    depth = tok.depth;
    var id = getId(filename + '_' + tok.text.trim());
    toc.push(new Array((depth - 1) * 2 + 1).join(' ') +
             '* <a href="#' + id + '">' +
             tok.text + '</a>');
    tok.text += '<span><a class="mark" href="#' + id + '" ' +
                'id="' + id + '">#</a></span>';
  });

  toc = marked.parse(toc.join('\n'));
  cb(null, toc);
}

var idCounters = {};
function getId(text) {
  text = text.toLowerCase();
  text = text.replace(/[^a-z0-9]+/g, '_');
  text = text.replace(/^_+|_+$/, '');
  text = text.replace(/^([^a-z])/, '_$1');
  if (idCounters.hasOwnProperty(text)) {
    text += '_' + (++idCounters[text]);
  } else {
    idCounters[text] = 0;
  }
  return text;
}
