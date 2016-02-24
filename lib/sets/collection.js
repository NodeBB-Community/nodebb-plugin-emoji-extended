"use strict";

let _ = require("lodash");

let Instance = require("./Instance");

const SET_MAP = {};
const SET_LIST = [];

/*===================================================== Exports  =====================================================*/

exports.MAP = SET_MAP;
exports.LIST = SET_LIST;

exports.register = register;
exports.destroy = destroy;

exports.transport = transport;

/*==================================================== Functions  ====================================================*/

/**
 * Register an emoji set.
 *
 * @param mod The set module.
 * @param id The ID of the set.
 */
function register(mod, id) { SET_LIST.push(SET_MAP[id] = new Instance(id, mod)); }

/**
 * Removes an emoji set.
 *
 * @param id The ID of the set to remove.
 */
function destroy(id) {
  let idx = _.findLastIndex(SET_LIST, function (instance) { return instance.id === id; });
  if (~idx) { SET_LIST.splice(idx, 1); }
  if (SET_MAP.hasOwnProperty(id)) { delete SET_MAP[id]; }
}

function transport() { return _.map(SET_LIST, function (s) { return s.transportCopy(); }); }
