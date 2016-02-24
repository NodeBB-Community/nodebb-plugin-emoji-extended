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
  },
  {
    id: "apple",
    name: "Emoji Apple",
    module: "nodebb-plugin-emoji-apple",
    preview: "//images.duckduckgo.com/iu/?u=http%3A%2F%2Ftse3.mm.bing.net%2Fth%3Fid%3DOIP.Mb24873a7b5d0e6971df17bfc70462a32o0%26pid%3D15.1&f=1",
    description: "A set of well designed emoji mostly by Apple Inc.<br/>License terms unknown. Use at own risk.<br/><a href=\"http://www.emoji-cheat-sheet.com/\" target=\"_blank\">Image Source</a>"
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
