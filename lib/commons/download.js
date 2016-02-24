"use strict";

let Q = require("q");
let fs = require("fs");
let http = require("http");
let https = require("https");

/*===================================================== Exports  =====================================================*/

exports.file = downloadToFile;
exports.buffer = fetchBuffer;

/*==================================================== Functions  ====================================================*/

function fetchBuffer(url, tls) {
  let defer = Q.defer();
  let data = [], dataLen = 0;
  (tls ? https : http).get(url, function (res) {
    res.on("data", function (chunk) {
      data.push(chunk);
      dataLen += chunk.length;
    });
    res.on("end", function () {
      let buf = new Buffer(dataLen);
      for (let i = 0, pos = 0; i < data.length; i++) {
        data[i].copy(buf, pos);
        pos += data[i].length;
      }
      defer.resolve(buf);
    });
    res.on("error", function (err) { defer.reject(err); });
  });
  return defer.promise;
}

function downloadToFile(targetFile, url, tls) {
  let defer = Q.defer();
  let fileWriter = fs.createWriteStream(targetFile);
  (tls ? https : http).get(url, function (res) {
    res.on("data", function (chunk) { fileWriter.write(chunk); });
    res.on("end", function () {
      fileWriter.end();
      defer.resolve(targetFile);
    });
    res.on("error", function (err) {
      fileWriter.end();
      defer.reject(err);
    });
  });
  return defer.promise;
}
