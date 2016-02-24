"use strict";

let _ = require("lodash");
let Q = require("q");
let nconf = require("nconf");

let settings = require("../settings");

const __SLICE = Array.prototype.slice;
const PROTOCOL_URL_REGEX = /^(?:[^\/]+:)?\/\//;
const RELATIVE_PATH = nconf.get("relative_path");

/*===================================================== Exports  =====================================================*/

module.exports = Instance;

/*==================================================== Functions  ====================================================*/

/*----------------------------------------------------- Instance -----------------------------------------------------*/

function Instance(id, mod) {
  let _update = typeof mod.update === "function";

  this.list = [];
  this.id = id;
  this.module = mod;
  this.static = !_update;
  this.mapping = callIfFunction(this, mod.mapping);
  this.details = this.updateDetails();

  let self = this;
  let busy = null;
  let lastJob = 0;

  this.use = wrapPromise(function (options) {
    self.list = [];
    return Q.when(mod.use(prepareOptions(options, self.id))).then(cacheList);
  });
  this.update = wrapPromise(function () { return _update ? Q.when(mod.update()).then(cacheList) : Q.when(self.list); });
  this.purge = typeof mod.purge === "function" ? wrapPromise(function () { return Q.when(mod.purge()); }) : _.noop;

  function wrapPromise(cb) {
    return function () {
      let args = arguments;
      let jobId = ++lastJob;
      // wait for busy before calling cb if busy existing
      busy = busy === null ? cb.apply(this, arguments) : busy.then(function () { return cb.apply(this, args); });
      // when finished, delete busy if no other job is waiting
      busy
          .fail(_.noop)
          .done(function () { if (lastJob === jobId) { busy = null; } });
      return busy;
    };
  }

  function cacheList(list) { return self.list = list; }
}

Instance.prototype.getLicense = function () { return this.module.license; };

Instance.prototype.getAttribution = function () { return callIfFunction(this, this.module.attribution); };

Instance.prototype.getURL = function () { return callIfFunction(this, this.module.url) || []; };

Instance.prototype.getMainStyles = function () { return callIfFunction(this, this.module.mainStyles) || null; };

Instance.prototype.getEmailStyles = function () { return callIfFunction(this, this.module.emailStyles) || null; };

Instance.prototype.isPrepared = function () { return nullFallback(callIfFunction(this, this.module.prepared), true); };

Instance.prototype.getParser = function () { return this.module.parse; };

Instance.prototype.transportCopy = Instance.prototype.updateDetails = function () {
  let mod = this.module;
  let details = this.details = {id: this.id, static: this.static};
  let preview = callIfFunction(this, mod.preview);
  details.name = mod.name;
  details.module = mod.moduleId;
  details.preview = preview == null ? preview : resolvePreview(preview);
  details.prepared = this.isPrepared();
  details.description = callIfFunction(this, mod.description);
  return details;
};

/*------------------------------------------------------ Utils  ------------------------------------------------------*/

function callIfFunction(self, obj) {
  return typeof obj === "function" ? obj.apply(self.module, __SLICE.call(arguments, 1)) : obj;
}

function nullFallback(obj, fb) { return obj == null ? fb : obj; }

function resolvePreview(url) { return PROTOCOL_URL_REGEX.test(url) ? url : RELATIVE_PATH + leadingSlash(url); }

function leadingSlash(string) { return string[0] === "/" ? string : "/" + string; }

function prepareOptions(options, id) {
  options.attributes = {
    class: _.constant(settings.emojiClasses + " emoji-parsed"),
    "data-set-id": _.constant(id),
    "data-emoji-id": attributeName,
    alt: attributeAlt,
    title: attributeIdentity
  };
  return options;
}

function attributeName(ignored, name) { return name; }

function attributeAlt(match, ignored, parameter) { return parameter == null ? match : parameter; }

function attributeIdentity(ignored, name, parameter) { return parameter == null ? name : parameter; }
