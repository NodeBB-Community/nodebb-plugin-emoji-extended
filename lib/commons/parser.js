"use strict";

let _ = require("lodash");

const TEST_REGEX = /:([a-z0-9_+-]+)(?:\[((?:[^\]]|][^:])*]?)])?:(?!")/g;

/*===================================================== Exports  =====================================================*/

exports.genParser = genParser;

exports.prepareParserList = prepareParserList;

exports.defaultParser = defaultParser;
exports.parserWithIndex = parserWithIndex;

/*==================================================== Functions  ====================================================*/

function prepareParserList(array, options) {
  let list = _.filter(array || [], function (item) { return !_.includes(options.excludes, item.id); });
  options.list = _.map(list, "id");
  return list;
}

function defaultParser(match, url, options) {
  let res = "<img src=\"" + url + "/" + encodeURIComponent(match[1]) + ".png\" ";
  for (let key in options.attributes) { //noinspection JSUnfilteredForInLoop
    res += key + "=\"" + options.attributes[key].apply(options, match) + "\" ";
  }
  return res + "/>";
}

function parserWithIndex(dataById, match, url, options) {
  let res = "<img src=\"" + url + dataById[match[1]].url + "\" ";
  for (let key in options.attributes) { //noinspection JSUnfilteredForInLoop
    res += key + "=\"" + options.attributes[key].apply(options, match) + "\" ";
  }
  return res + "/>";
}

function genParser(url, options) {
  if (options == null) { options = {}; }
  let parser = options.parser || defaultParser;

  return function (text) { return text.replace(TEST_REGEX, replaceFn); };

  function replaceFn(match, name) {
    return options.list.indexOf(name) === -1 ? match : parser(arguments, url, options);
  }
}
