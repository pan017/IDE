var checkAuth = require('../middleware/checkAuth');
var passport = require('passport');
var User = require('../models/user').User;
module.exports = function(app) {

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

 

  app.get('/login', require('./login').get);
  app.post('/login', require('./login').post);

  app.get('/registry', require('./registry').get);
  app.post('/registry', require('./registry').post);

  app.post('/logout', require('./logout').post);

  app.post('/files', require('./files').post);
  app.get('/files', require('./files').get);

  app.post('/delete', require('./delete').post);
  app.post('/rename', require('./rename').post);

  app.get('/brain', checkAuth,require('./brain').get);


};