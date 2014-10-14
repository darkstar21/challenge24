var app = require('./server-config.js');

var port = process.env.PORT || 4568;

var mongoose = require('mongoose');
var mongooseUrl = process.env.PORT ? 'mongodb://MongoLab:3ggjeGvPRwlunIIWDQF4z3yFcJ2ACpr.DTQAUFtqwRc-@ds045107.mongolab.com:45107/MongoLab':'mongodb://localhost/challenge24';
mongoose.connect(mongooseUrl);
app.listen(port);

console.log('Server now listening on port ' + port);
