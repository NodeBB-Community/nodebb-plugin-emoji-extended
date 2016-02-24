"use strict";

let _ = require("lodash");
let Q = require("q");

let settings = require("../settings");
let collection = require("./collection");

const MAP = collection.MAP;

let activateId = 0;

/*===================================================== Exports  =====================================================*/

exports.ids = [];
exports.sets = [];
exports.urls = {};
exports.styles = {email: "", main: ""};

exports.set = activate;
exports.reset = function () { return activate(settings.setSettings.get("active") || []); };
exports.isActive = function (id) { return _.includes(exports.ids, id); };

/*==================================================== Functions  ====================================================*/

function activate(setIds) {
  let aId = ++activateId;
  // create updated collections to export
  let ids = [];
  let sets = [];
  let urls = {};
  // filter sets that exist and are prepared
  for (let i = 0; i < setIds.length; i++) {
    let id = setIds[i];
    if (MAP.hasOwnProperty(id)) {
      let instance = MAP[id];
      if (instance.isPrepared()) {
        ids.push(id);
        sets.push(instance);
        urls[id] = instance.getURL();
      }
    }
  }
  // get updated styles
  return Q.spread([
    getMainStyles(sets),
    getEmailStyles(sets)
  ], function (main, email) {
    // if latest request, export new values
    if (aId === activateId) {
      exports.ids = ids;
      exports.sets = sets;
      exports.urls = urls;
      exports.styles.main = main;
      exports.styles.email = email;
    }
  });
}

function getMainStyles(sets) {
  return Q
      .all(_.map(sets, function (instance) { return instance.getMainStyles(); }))
      .then(_.compact)
      .then(function (styles) { return styles.join("\n"); });
}

function getEmailStyles(sets) {
  return Q
      .all(_.map(sets, function (instance) { return instance.getEmailStyles(); }))
      .then(_.compact)
      .then(function (styles) { return styles.join("\n"); });
}
