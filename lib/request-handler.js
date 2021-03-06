// var request = require('request');
// var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');
var Promise = require('bluebird');
var User = require('../app/models/user');
var Time = require('../app/models/time');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function(){
    res.redirect('/login');
  });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  User.findOne({ username: username }, function(err, user) {
    if (!user) {
      console.log('Incorrect username or password');
      res.redirect('/login');
    } else {
      comparePassword(password, user.password, function(match) {
        if (match) {
          util.createSession(req, res, user);
        } else {
          console.log('Incorrect username or password');
          res.redirect('/login');
        }
      })
    }
  });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({ username: username }, function(err, user) {
    if (!user) {
      hashPassword(password, function(pass){
        var newUser = new User({
          username: username,
          password: pass
        });
        newUser.save(function(err, newUser) {
          util.createSession(req, res, newUser);
        });
      });
    } else {
      console.log('Account already exists');
      res.redirect('/signup');
    }
  });
};

exports.recordTime = function(req, res) {
  var username = req.session.user.username;
  var timeToAdd = Number(req.body.time);

  Time.findOne({username: username}, function(err, time){
    if (!time){
      var newTime = new Time({
        username: username,
        totalTime: timeToAdd,
        gameCount: 1
      });
      newTime.save(function(err){
        res.end(''+timeToAdd);
      });
    } else {
      time.totalTime = time.get('totalTime') + timeToAdd;;
      time.gameCount = time.get('gameCount') + 1;
      time.save(function(err){
        res.end();
      });
    }
  });
};

exports.getAverageTime = function(req, res) {
  var username = req.session.user.username;

  Time.findOne({username: username}, function(err, time){
    if (!time){
      res.end();
    } else{
      var total = time.get('totalTime');
      var games = time.get('gameCount');
      var avg = Math.floor(total/games);
      res.end('' + avg);
    }
  });
};

var hashPassword = function(password, callback){
  var cipher = Promise.promisify(bcrypt.hash);
  cipher(password, null, null).bind(this)
    .then(function(hash) {
      callback(hash);
    });
};

var comparePassword = function(attemptedPassword, userHash, callback) {
  bcrypt.compare(attemptedPassword, userHash, function(err, isMatch) {
    callback(isMatch);
  });
};
