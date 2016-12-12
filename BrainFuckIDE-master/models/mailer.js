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
  // html - �� ��� ����� ������ ���������� � ������
});


var Q = require('q'); // ����������� �������� � ��������� � �� ���������
var nodemailer = require('nodemailer');
var emailTemplates = require('email-templates');
var sendMailTransport = require('nodemailer-sendmail-transport');
 
module.exports = {
  _transport: null,
  _template: null,
 
   // �������������� ��� mailer component
  init: function (config) {
     var d = Q.defer();
 
     // ������������� �������������
     emailTemplates(config.emailTplsDir, function (err, template) {
        if (err) {
           console.error(err);
           return d.reject(err);
        }
 
        this._template = template;
        // ������������� mailer��
        this._transport = nodemailer.createTransport(
           sendMailTransport({})
        );
        d.resolve();
     }.bind(this));
 
     return d.promise;
  },
 
  // �������� �������� e-mail
  sendMail: function (from, to, subject, text, html) {
     var d = Q.defer();
     var params = {
        from: from, // ����� �����������
        to: to, // ������ ����������� ����� �������
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
 
  // �������� e-mail � ��������
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