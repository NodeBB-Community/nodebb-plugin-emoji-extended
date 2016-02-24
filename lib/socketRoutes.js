"use strict";

let parser = require("./parser/main");
let plugins = require("./plugins");
let settings = require("./settings");
let setsCtrl = require("./sets/controller");

/*===================================================== Exports  =====================================================*/

module.exports.init = function () {
  initUserSockets(require.main.require("./src/socket.io/plugins"));
  initAdminSockets(require.main.require("./src/socket.io/admin"));
};

/*==================================================== Functions  ====================================================*/

/*-------------------------------------------------- Initialization --------------------------------------------------*/

function initUserSockets(Socket) {
  Socket[settings.iD] = {
    settings: getSettings,
    emojiList: function (ignore, ignored, cb) { cb(null, parser.activeList); },
    styles: function (ignore, ignored, cb) { cb(null, setsCtrl.styles.main); },
    parserPlugin: function (ignore, ignored, cb) { cb(null, plugins.getParserPluginId()); }
  };
}

function initAdminSockets(Socket) {
  Socket.settings["sync" + settings.Id] = syncSettings;
  Socket.settings["get" + settings.Id + "Defaults"] = settingsDefaults;

  Socket[settings.iD] = {
    activateSets: activateSets,
    updateSet: updateSet,
    purgeSet: purgeSet
  };
}

/*-------------------------------------------------- Socket Handler --------------------------------------------------*/

// settings

function getSettings(ignore, ignored, cb) {
  cb(null, {
    completion: settings.get("completion"),
    classes: settings.emojiClasses,
    legal: parser.activeLegal,
    sets: setsCtrl.getActiveIds().length,
    urls: setsCtrl.getActiveURLs()
  });
}

function syncSettings(ignore, ignored, cb) { settings.sync(cb); }

function settingsDefaults(ignore, ignored, cb) { cb(null, settings.createDefaultWrapper()); }

// set management

function activateSets(ignore, setIds, cb) {
  if (!(setIds instanceof Array)) { return cb("Argument has to be an Array."); }
  setsCtrl
      .setActive(setIds)
      .done(function () {
        parser.refresh();
        settings.setSettings.set("active", setsCtrl.getActiveIds());
        settings.setSettings.persist(function (err) {
          if (err != null) { return cb(err); }
          cb(null, setsCtrl.getActiveIds());
        });
      });
}

function updateSet(ignore, id, cb) {
  let instance = setsCtrl.getSetById(id);
  if (instance == null) { return cb("Set not found."); }
  instance
      .update()
      .done(function () {
        if (setsCtrl.isActive(id)) { parser.updateList(); }
        cb(null, instance.isPrepared());
      });
}

function purgeSet(ignore, id, cb) {
  let instance = setsCtrl.getSetById(id);
  if (instance == null) { return cb("Set not found."); }
  if (setsCtrl.isActive(id)) { return cb("Set is active."); }
  instance
      .purge()
      .done(function () { cb(null, instance.isPrepared()); }, cb);
}
