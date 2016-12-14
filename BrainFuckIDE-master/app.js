var express = require('express');
var http = require('http');
var path = require('path');
var bodyParser = require('body-parser');
var config = require('./config');
var mongoose = require('./libs/mongoose');
var log = require('./libs/log')(module);
var HttpError = require('./error').HttpError;
var app = express();
var passport = require('passport');
var passp = require('./routes/passport');
app.engine('ejs', require('ejs-locals'));
app.set('views', __dirname + '/template');
app.set('view engine', 'ejs');



if (app.get('env') == 'development') {
    app.use(express.logger('dev'));
} else {
    app.use(express.logger('default'));
}

//app.use(express.bodyParser());
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(express.cookieParser());

var MongoStore = require('connect-mongo')(express);

app.use(express.session({
    secret: config.get('session:secret'),
    key: config.get('session:key'),
    cookie: config.get('session:cookie'),
    store: new MongoStore({mongooseConnection: mongoose.connection})
}));

app.use(require('./middleware/sendHttpError'));
app.use(require('./middleware/loadUser'));
app.use(require('./routes/passport'));
app.use(passport.initialize());
app.use(passport.session());
app.use(app.router);

require('./routes')(app);

app.use(express.static(path.join(__dirname, 'public')));

app.use(function(err, req, res, next) {
    if (typeof err == 'number') { // next(404);
        err = new HttpError(err);
    }


    if (err instanceof HttpError) {
        res.sendHttpError(err);
    } else {
        if (app.get('env') == 'development') {
            express.errorHandler()(err, req, res, next);
        } else {
            log.error(err);
            err = new HttpError(500);
            res.sendHttpError(err);
        }
    }
});
http.createServer(app).listen(config.get('port'), function(){
    log.info('Express server listening on port ' + config.get('port'));
});
