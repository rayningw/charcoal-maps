var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

var server = app.listen(3000, function() {
  console.log('Listening on port %d', server.address().port);
});

