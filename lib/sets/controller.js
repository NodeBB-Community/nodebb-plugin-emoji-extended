"use strict";

let active = require("./active");
let modules = require("./modules");
let collection = require("./collection");

/*===================================================== Exports  =====================================================*/

exports.styles = active.styles;

exports.register = collection.register;
exports.destroy = collection.destroy;

exports.setActive = active.set;
exports.resetActive = active.reset;
exports.isActive = active.isActive;
exports.getActiveIds = function () { return active.ids; };
exports.getActiveSets = function () { return active.sets; };
exports.getActiveURLs = function () { return active.urls; };

exports.getNotInstalledList = modules.getNotInstalled;

exports.transportCollection = collection.transport;

exports.getSetById = function (id) { return collection.MAP[id]; };
