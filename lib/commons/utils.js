"use strict";

let path = require("path");

/*===================================================== Exports  =====================================================*/

exports.wrapId = wrapId;
exports.pathToURI = pathToURI;

/*==================================================== Functions  ====================================================*/

function wrapId(id) { return {id: id}; }

function pathToURI(filename) { return filename.split(path.delimiter).map(encodeURIComponent).join("/"); }
