var checkAuth = require('../middleware/checkAuth');
var User = require('../models/user').User;
const VKontakteStrategy = require('passport-vkontakte').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var passport = require('passport');
var User = require('../models/user').User;
var express = require('express');


module.exports = function(app) {




var sess;
  app.get('/', function(req, res) {
sess = req.session;
  if (!sess.user) {
 	res.redirect('./login');
 
  }
else
{
User.findById(req.session.user, function(err, user) {
    if (err) return next(err);

    req.user = res.locals.user = user;
});
res.redirect('./brain');
}
});

  app.get('/auth/vk',
  passport.authenticate('vkontakte'),
  function(req, res){
    // The request will be redirected to VK for authentication, so this
    // function will not be called.
  });

app.get('/auth/vkontakte/callback', 
  passport.authenticate('vkontakte', {
    failureRedirect: '/login'
}),  function (req, res) 
 {
console.log('asdasd');
            // Successful authentication
            //, redirect home.
            res.redirect('http://localhost:3000/brain');
        });
app.get('/auth/twitter', passport.authenticate('twitter'));

app.get('/login/twitter/callback', passport.authenticate('twitter', {
    failureRedirect: '/login',
function (req, res) 
 {
console.log('asdasd');
sess = req.session
                    sess.user = user._id;
        res.send({});
            res.redirect('http://localhost:3000/brain');
        }}));


app.get('/auth/facebook', passport.authenticate('facebook', { scope : ['email'] }));

app.get('/login/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/login'
}));

  app.get('/login', require('./login').get);
  app.post('/login', require('./login').post);

  app.get('/registry', require('./registry').get);
  app.post('/registry', require('./registry').post);

  app.post('/logout', require('./logout').post);

  app.post('/files', require('./files').post);
  app.get('/files', require('./files').get);

  app.post('/delete', require('./delete').post);
  app.post('/rename', require('./rename').post);

  app.get('/brain',require('./brain').get);


};