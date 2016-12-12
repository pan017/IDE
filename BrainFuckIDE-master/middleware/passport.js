var config = require("nconf");
var passport = require('passport');
var AuthLocalStrategy = require('passport-local').Strategy;
var AuthFacebookStrategy = require('passport-facebook').Strategy;
var AuthVKStrategy = require('passport-vkontakte').Strategy;

passport.use('facebook', new AuthFacebookStrategy({
        clientID: config.get("auth:fb:app_id"),
        clientSecret: config.get("auth:fb:secret"),
        callbackURL: config.get("app:url") + "/auth/fb/callback",
        profileFields: [
            'id',
            'displayName',
            'profileUrl',
            "username",
            "link",
            "gender",
            "photos"
        ]
    },
    function (accessToken, refreshToken, profile, done) {
 
        //console.log("facebook auth: ", profile);
 
        return done(null, {
            username: profile.displayName,
            photoUrl: profile.photos[0].value,
            profileUrl: profile.profileUrl
        });
    }
));

passport.use('vk', new AuthVKStrategy({
        clientID: config.get("5772998"),
        clientSecret: config.get("JS95JFzwbxZo8Rfd1wxt"),
        callbackURL: config.get("http://localhost:3000") + "/auth/vk/callback"
    },
    function (accessToken, refreshToken, profile, done) {
 
        //console.log("facebook auth: ", profile);
 
        return done(null, {
            username: profile.displayName,
            photoUrl: profile.photos[0].value,
            profileUrl: profile.profileUrl
        });
    }
));