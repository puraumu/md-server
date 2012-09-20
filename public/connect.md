
[![build status](https://secure.travis-ci.org/senchalabs/connect.png)](http://travis-ci.org/senchalabs/connect)

# Connect

  Connect is an extensible HTTP server framework for [node](http://nodejs.org), providing high performance "plugins" known as _middleware_.

 Connect is bundled with over _20_ commonly used middleware, including
 a logger, session support, cookie parser, and [more](http://senchalabs.github.com/connect). Be sure to view the 2.x [documentation](http://senchalabs.github.com/connect/).

```js
var connect = require('connect')
  , http = require('http');

var app = connect()
  .use(connect.favicon())
  .use(connect.logger('dev'))
  .use(connect.static('public'))
  .use(connect.directory('public'))
  .use(connect.cookieParser())
  .use(connect.session({ secret: 'my secret here' }))
  .use(function(req, res){
    res.end('Hello from Connect!\n');
  });

http.createServer(app).listen(3000);
```

## Middleware

  - csrf
  - basicAuth
  - bodyParser
  - json
  - multipart
  - urlencoded
  - cookieParser
  - directory
  - compress
  - errorHandler
  - favicon
  - limit
  - logger
  - methodOverride
  - query
  - responseTime
  - session
  - static
  - staticCache
  - vhost
  - subdomains
  - cookieSession

## Running Tests

first:

    $ npm install -d

then:

    $ make test

