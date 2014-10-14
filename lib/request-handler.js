// var request = require('request');
// var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');
var Promise = require('bluebird');
var User = require('../app/models/user');

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
  console.log(username)
  User.find({ username: username }, function(err, user) {
    console.log(user)
      if (!user) {
        res.redirect('/login');
      } else {
        comparePassword(password, user[0].password, function(match) {
          if (match) {
            util.createSession(req, res, user);
          } else {
            res.redirect('/login');
          }
        })
      }
  });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.find({ username: username }, function(err, user) {
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
        alert('Account already exists');
        res.redirect('/signup');
      }
    })
};

var hashPassword = function(password, callback){
  var cipher = Promise.promisify(bcrypt.hash);
  cipher(password, null, null).bind(this)
    .then(function(hash) {
      callback(hash)
    });
}

var comparePassword = function(attemptedPassword, userHash, callback) {
  bcrypt.compare(attemptedPassword, userHash, function(err, isMatch) {
    callback(isMatch);
  });
}
