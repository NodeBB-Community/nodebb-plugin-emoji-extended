"use strict";

let email = require("./email");
let parser = require("./parser/main");
let plugins = require("./plugins");
let settings = require("./settings");
let composer = require("./composer");
let setsCtrl = require("./sets/controller");
let adminPages = require("./adminPages");
let socketRoutes = require("./socketRoutes");

/*===================================================== Exports  =====================================================*/

exports.init = init;

exports.adminMenu = addNavigation;
exports.composerFormatting = addComposerButton;

exports.parse = parsePlain;
exports.parsePostData = parsePost;

exports.pluginDeactivation = plugins.onPluginDisabled;
exports.pluginActivation = plugins.onPluginEnabled;

exports.email = email.parse;

/*==================================================== Functions  ====================================================*/

function addNavigation(data, cb) {
  adminPages.addNavigation(data);
  cb(null, data);
}

function addComposerButton(data, cb) {
  composer.formatting(data.options);
  cb(null, data);
}

function parsePlain(text, cb) { cb(null, parser.parse(text)); }

function parsePost(data, cb) {
  //noinspection JSUnresolvedVariable
  data.postData.content = parser.parse(data.postData.content);
  cb(null, data);
}

function init(data, cb) {
  socketRoutes.init();
  settings.init
      .then(function () { return setsCtrl.resetActive(); })
      .done(function () { parser.refresh().done(); });
  adminPages.init(data, cb);
}
