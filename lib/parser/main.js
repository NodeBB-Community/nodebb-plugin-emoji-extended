"use strict";

let _ = require("lodash");
let Q = require("q");

let mapping = require("./mapping");
let settings = require("../settings");
let setsCtrl = require("../sets/controller");

const OUTSIDE_CODE = /(^|<\/code>)([^<]*|<(?!code[^>]*>))*(<code[^>]*>|$)/g;
const LIST_PROPERTIES = ["id", "file", "classes", "category", "aliases", "width", "height"];

let parser = [];
let options = {};
let refreshPromise = Q.when();

/*===================================================== Exports  =====================================================*/

exports.activeList = [];
exports.activeLegal = [];

exports.updateList = function () { updateLists(setsCtrl.getActiveSets()); };
exports.refresh = refresh;
exports.parse = parse;

/*==================================================== Functions  ====================================================*/

function refresh() {
  options = settings.setSettings.get("options");
  return refreshPromise = refreshPromise
      .fail(_.noop)
      .then(function () {
        return Q.all(_.map(setsCtrl.getActiveSets(), function (instance) {
          return instance
              .use(_.cloneDeep(options[instance.id] || settings.defaultSetSettingsEntry))
              .then(_.constant(instance));
        }));
      })
      .then(updateLists);
}

function updateLists(instances) {
  exports.activeList = [];
  exports.activeLegal = [];
  parser = [];
  _.each(instances, addInstance);
  exports.activeList = _.chain(exports.activeList).sortBy("id").sortedUniqBy("id").value();
}

function addInstance(instance) {
  let opts = options[instance.id] || settings.defaultSetSettingsEntry;
  if (opts.mapping && instance.hasMapping()) {
    let map = mapping.generate(instance.mapping, opts.excludes);
    if (map != null) { parser.push(map); }
  }
  parser.push(instance.getParser());
  Array.prototype.push.apply(exports.activeList, getListOf(instance));
  // add legal info
  let attribution = instance.getAttribution();
  let license = instance.getLicense();
  if (attribution != null || license != null) {
    exports.activeLegal.push({setId: instance.id, attribution: attribution, license: license});
  }
}

function getListOf(instance) {
  let setId = instance.details.id;
  return _.map(instance.list, function (item) {
    item = _.pick(item, LIST_PROPERTIES);
    item.setId = setId;
    return item;
  });
}

function parsePartial(text) {
  for (let i = 0; i < parser.length; i++) { text = parser[i](text); }
  return text;
}

function parse(text) { return text.replace(OUTSIDE_CODE, parsePartial); }
