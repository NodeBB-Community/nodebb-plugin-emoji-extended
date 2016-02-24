"use strict";

let fs = require("fs");

/*===================================================== Exports  =====================================================*/

exports.access = fs.hasOwnProperty("access") ? fs.access : access;
exports.accessSync = fs.hasOwnProperty("accessSync") ? fs.accessSync : accessSync;

/*==================================================== Functions  ====================================================*/

function access(file, ignored, cb) {
  if (typeof ignored === "function") { cb = ignored; }
  fs.exists(file, function (bool) { if (bool) { cb(); } else { cb("File does not exist."); } });
}

function accessSync(file) { if (!fs.existsSync(file)) { throw new Error("File does not exist."); } }
