"use strict";

let _ = require("lodash");

const MAPPING_BEFORE = "^|\\s|<\\/?[\\w-]+>";
const MAPPING_AFTER = "<\\/?[\\w-]+>|\\s|$";

/*===================================================== Exports  =====================================================*/

exports.generate = generate;

/*==================================================== Functions  ====================================================*/

function RegexObject(regex) {
  this.source = regex.source;
  this.options = (regex.global ? "g" : "") + (regex.ignoreCase ? "i" : "") + (regex.multiline ? "m" : "");
}

function generate(mapping, excludes) {
  if (mapping == null) { return null; }
  let leadingRE = "";
  let leading = [], wrapped = [];
  // normalize mappings RegExp objects
  _.each(mapping.separationLeading, function (entry, key) {
    if (!_.includes(excludes, key)) { leadingRE = addLeading(leading, key, entry, leadingRE); }
  });
  _.each(mapping.separationWrapped, function (entry, key) {
    if (!_.includes(excludes, key)) { addWrapped(wrapped, key, entry); }
  });
  // generate function with maximum performance
  if (leading.length) {
    let regex = new RegExp("(?:" + MAPPING_BEFORE + ")(" + leadingRE + ")", "ig");
    let handler = genLeadingHandler(leading);
    return wrapped.length ? genLeadingAndWrapped(regex, handler, wrapped) : genLeading(regex, handler);
  } else {
    return wrapped.length ? genWrapped(wrapped) : null;
  }
}

function genLeadingHandler(leading) {
  let _len = leading.length;
  return function (text) {
    for (let i = 0; i < _len; i++) {
      let current = leading[i];
      let result = text.replace(current.regex, current.key);
      if (result !== text) { return result; }
    }
    return text;
  };
}

function genLeading(regExp, handler) { return function (text) { return text.replace(regExp, handler); }; }

function genWrapped(wrapped) {
  let _len = wrapped.length;
  return function (text) {
    for (let i = 0; i < _len; i++) {
      let current = wrapped[i];
      text = text.replace(current.regex, current.key);
    }
    return text;
  };
}

function genLeadingAndWrapped(leadingRegExp, leadingHandler, wrapped) {
  return function (text) {
    text = text.replace(leadingRegExp, leadingHandler);
    for (let i = 0; i < wrapped.length; i++) {
      let entry = wrapped[i];
      text = text.replace(entry.regex, entry.key);
    }
    return text;
  };
}

function addLeading(target, key, regexObject, leadingFullRegex) {
  if (regexObject instanceof Array) {
    _.each(regexObject, function (obj) { leadingFullRegex = addLeading(target, key, obj, leadingFullRegex); });
    return leadingFullRegex;
  }
  regexObject = new RegexObject(regexObject);

  let regexSource = "(" + regexObject.source + ")";
  let regexOptions = regexObject.options;
  if (!~regexOptions.indexOf("g")) { regexOptions += "g"; }

  target.push({regex: new RegExp(regexSource, regexOptions), key: ":" + key + "[$1]:"});

  return leadingFullRegex + (leadingFullRegex ? "|" : "") + regexObject.source;
}

function addWrapped(target, key, regexObject) {
  if (regexObject instanceof Array) {
    _.each(regexObject, function (obj) { addWrapped(target, key, obj); });
    return;
  }
  regexObject = new RegexObject(regexObject);

  let regexSource = "(" + MAPPING_BEFORE + ")(" + regexObject.source + ")(" + MAPPING_AFTER + ")";
  let regexOptions = regexObject.options;
  if (!~regexOptions.indexOf("g")) { regexOptions += "g"; }

  target.push({regex: new RegExp(regexSource, regexOptions), key: "$1:" + key + "[$2]:$3"});
}
