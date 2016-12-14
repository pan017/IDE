var checkAuth = require('../middleware/checkAuth');
var passport = require('passport');
var User = require('../models/user').User;
const VKontakteStrategy = require('passport-vkontakte').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var passport = require('passport');
var User = require('../models/user').User;



module.exports = function(app) {
passport.use(new VKontakteStrategy(
  {
    clientID: '5772998', // VK.com docs call it 'API ID', 'app_id', 'api_id', 'client_id' or 'apiId'
    clientSecret: 'JS95JFzwbxZo8Rfd1wxt',
    callbackURL:  'http://localhost:3000/auth/vkontakte/callback'
  },
  function (accessToken, refreshToken, params, profile, done) {
}
));




passport.use(new TwitterStrategy({
    'consumerKey': 'aiHnvAAveuCetontmKc1GzeEE',
    'consumerSecret': 'WcOqrQFnl0F9zVx2Ufccb52faXDsbeETs0KBLkfN2Mypd3Anxz',
   'callbackURL': 'http://localhost:3000/login/twitter/callback'
}, function (token, tokenSecret, profile, callback) {
    api.findOrCreateUser(profile, callback);
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

            // find the user in the database based on their facebook id
            User.findOne({ 'facebook.id' : profile.id }, function(err, user) {

                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err)
                    return done(err);

                // if the user is found, then log them in
                if (user) {
                    return done(null, user); // user found, return that user
                } else {
                    // if there is no user found with that facebook id, create them
                    var newUser            = new User();

                    // set all of the facebook information in our user model
                    newUser.facebook.id    = profile.id; // set the users facebook id                   
                    newUser.facebook.token = token; // we will save the token that facebook provides to the user                    
                    newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                    newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

                    // save our user to the database
                    newUser.save(function(err) {
                        if (err)
                            throw err;

                        // if successful, return the new user
                        return done(null, newUser);
                    });
                }

            });
        });
  }));

  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

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

app.get('/auth/vk/callback', 
  passport.authenticate('vkontakte', {
    failureRedirect: '/login'
}),  function (req, res) 
 {
console.log('asdasd');
            // Successful authentication
            //, redirect home.
            res.redirect('/brain');
        });

app.get('/auth/twitter', passport.authenticate('twitter'));

app.get('/auth/twitter/callback', passport.authenticate('twitter', {
    successRedirect: './brain',
    failureRedirect: '/login'
}));


app.get('/auth/facebook', passport.authenticate('facebook', { scope : ['email'] }));

app.get('/auth/facebook/callback', passport.authenticate('facebook', {
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