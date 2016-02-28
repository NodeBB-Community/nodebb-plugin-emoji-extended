"use strict";

let _ = require("lodash");

let settings = require("./settings");
let setsCtrl = require("./sets/controller");

const PAGES = [
  {
    name: settings.pkg.nbbpm.name,
    icon: "fa-smile-o",
    route: "/plugins/" + settings.id,
    template: function () {
      return {
        id: settings.pkg.name, name: settings.pkg.nbbpm.name, version: settings.pkg.version,
        settings: settings.get(),
        sets: {
          defaultOptions: settings.defaultSetSettingsEntry,
          active: setsCtrl.getActiveIds(),
          installed: _.map(setsCtrl.transportCollection(), function (setDetails) {
            return _.assign({
              options: settings.setSettings.get("options." + setDetails.id) || settings.defaultSetSettingsEntry
            }, setDetails);
          }),
          notInstalled: setsCtrl.getNotInstalledList()
        }
      };
    }
  }
];

/*===================================================== Exports  =====================================================*/

exports.init = init;
exports.addNavigation = addNavigation;

/*==================================================== Functions  ====================================================*/

function addNavigation(header) {
  for (let i = 0; i < PAGES.length; i++) {
    let page = PAGES[i];
    header.plugins.push({name: page.name, icon: page.icon, route: page.route});
  }
}

function init(data, cb) {
  for (let i = 0; i < PAGES.length; i++) { initPageRoute(data.router, data.middleware.admin.buildHeader, PAGES[i]); }
  cb(null, data);
}

function initPageRoute(router, UIMiddleware, page) {
  let render = _.partial(renderPage, page);
  router.get("/admin" + page.route, UIMiddleware, render);
  router.get("/api/admin" + page.route, render);
}

function renderPage(page, req, res) {
  res.render("admin" + page.route, typeof page.template === "function" ? page.template(req, res) : {});
}
