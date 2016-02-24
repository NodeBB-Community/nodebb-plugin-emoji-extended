"use strict";

let setsCtrl = require("./sets/controller");

/*===================================================== Exports  =====================================================*/

exports.parse = prependStylesToEmail;

/*==================================================== Functions  ====================================================*/

function prependStylesToEmail(email, cb) {
  let style = setsCtrl.styles.email;
  if (style) { email.html = "<style type=\"text/css\">" + style + "</style>\n" + email.html; }
  cb(null, email);
}
