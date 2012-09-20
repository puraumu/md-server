var connect = require('connect')
  , custom = require('./')
  , app = connect()

app.use(connect.logger('dev'));
app.use(custom.markdown('public'));
app.use(connect.static('public'));
app.use(connect.directory('public'));

app.listen(3000);
