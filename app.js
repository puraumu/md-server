var connect = require('connect')
  , app = connect()

app.use(connect.logger('dev'));
app.use(connect.static('public'));
app.use(connect.directory('public'));

app.listen(3000);
