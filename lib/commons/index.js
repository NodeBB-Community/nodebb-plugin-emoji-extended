"use strict";

let _ = require("lodash");
let Q = require("q");
let path = require("path");

let utils = require("./utils");

const VECTOR_EXTENSIONS = [".svg"];

/*===================================================== Exports  =====================================================*/

module.exports = build;

/*==================================================== Functions  ====================================================*/

function build(glob, sizeOf, index, assetsPath) {
  let images = index.images || {};
  return Q
      .nfcall(glob, index.files || "**/*", {cwd: assetsPath, nodir: true, ignore: index.ignore || null})
      .then(function (files) {
        let byId = {};
        let list = _.map(files, function (file) {
          let filename = path.basename(file), ext = path.extname(filename);
          let id = ext ? filename.substring(0, filename.length - ext.length) : filename;
          byId[id] = file;
          // if index-file contains advanced properties for this image, use them
          if (images.hasOwnProperty(id)) { return _.assign({id: id}, images[id], {file: filename}); }
          // if root directory, no automatic categorization possible
          if (path.dirname(file) === ".") { return images[id] = {id: id, file: filename}; }
          // if nested file structure, use directories for categorization
          return images[id] = {id: id, file: filename, category: path.dirname(file).replace(/[\/\\]/g, ".")};
        });
        let dataById = {};
        let promises = _.map(byId, function (file, id) {
          let width = images[id].width, height = images[id].height;
          let promise;
          if (sizeOf != null && (width == null || height == null)) {
            promise = Q
                .nfcall(sizeOf, path.join(assetsPath, file))
                .then(function (size) {
                  width = width == null ? size.width : width;
                  height = height == null ? size.height : height;
                  if (width != null || height != null) {
                    if (_.includes(VECTOR_EXTENSIONS, path.extname(file))) {
                      // transfer image size if original size and vector graphics
                      if (width != null) { images[id].width = width; }
                      if (height != null) { images[id].height = height; }
                    }
                  }
                }, _.noop);
          } else {
            promise = Q.when();
          }
          return promise.then(function () {
            dataById[id] = {url: "/" + utils.pathToURI(file), width: width, height: height};
          });
        });
        return Q.all(promises).then(_.constant({dataById: dataById, list: list}));
      });
}
