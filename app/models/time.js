var mongoose = require('mongoose');

var timeSchema = mongoose.Schema({
    username: String,
    totalTime: Number,
    gameCount: Number
  });

var Time = mongoose.model("Time", timeSchema);
module.exports = Time;
