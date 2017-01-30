const VKontakteStrategy = require('passport-vkontakte').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var passport = require('passport');
var User = require('../models/user').User;
var HttpError = require('../error').HttpError;
var AuthError = require('../models/user').AuthError;
var async = require('async');
var express = require('express');
var app = express();
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});
var sess;

app.use(passport.session());
passport.use(new VKontakteStrategy(
  {
    clientID: '5772998', // VK.com docs call it 'API ID', 'app_id', 'api_id', 'client_id' or 'apiId'
    clientSecret: 'JS95JFzwbxZo8Rfd1wxt',
    callbackURL:  'http://localhost:3000/auth/vkontakte/callback',
scope: ['email'],
    profileFields: ['email']
  },
  function verify(accessToken, refreshToken, params, profile, done) {

    process.nextTick(function () {
     User.registrationFromSocialNetwork(profile.id, 'vk', function(err, user) {
       
	//passport.session().user = user;
	console.log(user);

    });
console.log(profile);
    });
  }
));




passport.use(new TwitterStrategy({
    'consumerKey': 'aiHnvAAveuCetontmKc1GzeEE',
    'consumerSecret': 'WcOqrQFnl0F9zVx2Ufccb52faXDsbeETs0KBLkfN2Mypd3Anxz',
   'callbackURL': 'http://localhost:3000/login/twitter/callback'
}, function (token, tokenSecret, profile, callback) {
    
}));


passport.use(new FacebookStrategy({
    clientID: '667603280085899',
    clientSecret: '1ad4883f12e98c9c7abf03d192aa6a8a',
    callbackURL: 'http://localhost:3000/login/facebook/callback',
    enableProof: true,
passReqToCallback : true,
            profileFields: ['id', 'emails', 'name'] //This
  },
   function (accessToken, refreshToken, profile, done) {            
            
   process.nextTick(function() {
        });
  }));

module.exports.passport = passport;