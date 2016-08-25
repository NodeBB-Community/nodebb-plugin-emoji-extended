"use strict";

let _ = require("lodash");

/*============================== List of known modules that integrate with this plugin  ==============================*/

const MODULES = [
  {
    id: "static",
    name: "Static Images",
    module: "nodebb-plugin-emoji-static",
    description: "Use custom image files."
  },
  {
    id: "one",
    name: "Emoji One",
    module: "nodebb-plugin-emoji-one",
    preview: "https://raw.githubusercontent.com/NodeBB-Community/nodebb-plugin-emoji-one/master/public/static/preview.png",
    description: "Icons provided free by <a href=\"http://emojione.com\" target=\"_blank\">Emoji One</a>"
  },
  {
    id: "cubicopp",
    name: "Emoji Cubicopp",
    module: "nodebb-plugin-emoji-cubicopp",
    preview: "https://raw.githubusercontent.com/NodeBB-Community/nodebb-plugin-emoji-cubicopp/master/public/static/preview.png",
    description: "A set of square-shaped public domain 'Cubicopp' emoji.<br/><a href=\"http://publicdomainvectors.org/en/search/cubicopp/\" target=\"_blank\">Image Source</a>"
  }
];

/*===================================================== Exports  =====================================================*/

exports.MODULES = MODULES;

exports.getNotInstalled = getNotInstalled;

/*==================================================== Functions  ====================================================*/

function getNotInstalled() {
  return _.filter(MODULES, function (ext) {
    // TODO return true (and mark installed, but not NodeBB enabled) if installed but not enabled within NodeBB
    try { require.resolve(ext.module); } catch (e) { return true; }
    return false;
  });
}
