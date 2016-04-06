"use strict";

let Q = require("q");

const CLASSES = "not-responsive emoji";

let Settings = require.main.require("./src/settings");

let packageJSON = require("../package.json");

/*
 * This file exports a NodeBB Settings Object and a few meta-data of the project.
 *
 * See https://docs.nodebb.org/en/latest/plugins/settings.html for more details on the Settings Object.
 *
 * This file by default gets meta-replaced (thus @{...} gets resolved within the grunt-tasks).
 * It is not recommended to add any more files, rather it is recommended to add additional exports here if needed.
 */

const ENV = "@{env}", DEV = (ENV === "development");
const PLUGIN_ID = "@{id}";
const DEFAULT_SET_SETTINGS_ENTRY = {mapping: true, excludes: []};

let defaultPluginSettings = {completion: {maxLines: 8, minChars: 0, prefix: "^|[^\\w\\)\\]\\}\\-+]", enabled: true}};
let defaultSetSettings = {active: ["emoji-one"], options: {"emoji-one": {mapping: true, excludes: [/* String */]}}};
let initDefer = Q.defer();

let pluginSettings = new Settings(PLUGIN_ID, packageJSON.version, defaultPluginSettings, null, DEV, false);
let setSettings = new Settings(PLUGIN_ID + "-sets", packageJSON.version, defaultSetSettings, resolveInit, DEV, false);

/*===================================================== Exports  =====================================================*/

exports = module.exports = pluginSettings;
exports.setSettings = setSettings;

exports.defaultSetSettingsEntry = DEFAULT_SET_SETTINGS_ENTRY;
exports.emojiClasses = CLASSES;
exports.name = "@{name}";
exports.id = PLUGIN_ID;
exports.Id = "@{Id}";
exports.iD = "@{iD}";
exports.ID = "@{ID}";
exports.dev = DEV;
exports.env = ENV;
exports.pkg = packageJSON;
exports.init = initDefer.promise;

/*==================================================== Functions  ====================================================*/

function resolveInit(err) { if (err == null) { initDefer.resolve(exports); } else { initDefer.reject(err); } }
