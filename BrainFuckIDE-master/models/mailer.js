var emailTemplates = require('email-templates');
var tpl;
var emailTplsDir = 'path/to/email/templates/folder';
emailTemplates(emailTplsDir, function (err, template) {
  if (err) {
     console.error(err);
  } else {
     tpl = template;
  }
});

var tplName = 'template-name';
var locals = {user: 'Alex'};
template(tplName, locals, function (err, html, text) {
  if (err) {
     winston.error(err);
  }
  // html - то что будем дальше отправл€ть в письме
});


var Q = require('q'); // предпочитаю работать с промисами а не колбеками
var nodemailer = require('nodemailer');
var emailTemplates = require('email-templates');
var sendMailTransport = require('nodemailer-sendmail-transport');
 
module.exports = {
  _transport: null,
  _template: null,
 
   // инициализируем наш mailer component
  init: function (config) {
     var d = Q.defer();
 
     // инициализаци€ шаблонизатора
     emailTemplates(config.emailTplsDir, function (err, template) {
        if (err) {
           console.error(err);
           return d.reject(err);
        }
 
        this._template = template;
        // инициализаци€ mailerТа
        this._transport = nodemailer.createTransport(
           sendMailTransport({})
        );
        d.resolve();
     }.bind(this));
 
     return d.promise;
  },
 
  // отправка обычного e-mail
  sendMail: function (from, to, subject, text, html) {
     var d = Q.defer();
     var params = {
        from: from, // адрес отправител€
        to: to, // список получателей через зап€тую
        subject: subject,
        text: text
     };
 
     if (html) {
        params.html = html;
     }
 
     this._transport.sendMail(params, function (err, res) {
        if (err) {
           console.error(err);
           d.reject(err);
        } else {
           d.resolve(res);
        }
     });
 
     return d.promise;
  },
 
  // отправка e-mail с шаблоном
  sendMailTemplate: function (from, to, subject, tplName, locals) {
    var d = Q.defer();
 
    this._template(tplName, locals, function (err, html, text) {
       if (err) {
          console.error(err);
          return d.reject(err);
       }
 
       this.sendMail(from, to, subject, text, html)
          .then(function (res) {
             d.resolve(res);
          });
    }.bind(this));
 
    return d.promise;
  }
};