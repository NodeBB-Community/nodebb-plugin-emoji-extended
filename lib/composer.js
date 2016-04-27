"use strict";

let settings = require("./settings");
let setsCtrl = require("./sets/controller");

const FORMATTING = [
  {name: settings.id, className: "fa fa-smile-o", title: "[[" + settings.iD + ":composer.title]]"}
];

let __push = Array.prototype.push;

/*===================================================== Exports  =====================================================*/

exports.formatting = function (data) { if (setsCtrl.getActiveIds().length) { __push.apply(data, FORMATTING); } };
