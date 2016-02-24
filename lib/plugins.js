"use strict";

let plugins = require.main.require("./src/plugins");

const KNOWN_PARSER = [
  "nodebb-plugin-markdown"
];

let parserPlugin = null;

/*===================================================== Exports  =====================================================*/

exports.getParserPluginId = getParserPluginId;

exports.onPluginDisabled = onPluginDisabled;
exports.onPluginEnabled = onPluginEnabled;

/*==================================================== Functions  ====================================================*/

function getParserPluginId() {
  if (parserPlugin !== null) { return parserPlugin; }
  for (var i = 0; i < KNOWN_PARSER.length; i++) {
    if (plugins.libraries.hasOwnProperty(KNOWN_PARSER[i])) { return parserPlugin = KNOWN_PARSER[i]; }
  }
  return null;
}

function onPluginDisabled(id) { if (id === parserPlugin) { parserPlugin = null; } }

function onPluginEnabled() { parserPlugin = null; }
