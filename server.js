var app = require('./server-config.js');

var port = process.env.PORT || 4568;

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/challenge24');
app.listen(port);

console.log('Server now listening on port ' + port);