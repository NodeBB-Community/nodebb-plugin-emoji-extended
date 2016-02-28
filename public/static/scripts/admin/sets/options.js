define("@{type.name}/@{id}/admin/sets/options", [
  "@{type.name}/@{id}/debug",
  "@{type.name}/@{id}/admin/sets/data"
], function (debug, data) {
  "use strict";

  var RESOLVED = $.Deferred().resolve().promise();

  /*==================================================== Exports  ====================================================*/

  return {
    save: readAndSave,
    reset: reset,
    purge: purge
  };

  /*=================================================== Functions  ===================================================*/

  function readOptions($wrapper) {
    var options = {};
    options.mapping = $wrapper.find(".option-mapping").prop("checked");
    options.excludes = $.map($wrapper.find(".option-excludes").val().split(","), function (s) { return s.trim(); });
    return options;
  }

  function writeOptions($wrapper, options) {
    $wrapper.find(".option-mapping").prop("checked", options.mapping);
    $wrapper.find(".option-excludes").val(options.excludes.join(", "));
  }

  function reset($wrapper, s) {
    debug.log(s.id, "  reset options");
    writeOptions($wrapper, s.options);
    return RESOLVED;
  }

  function readAndSave($wrapper, s) {
    debug.log(s.id, "  save options");
    return query("admin.settings.update@{Id}Set", {id: s.id, options: readOptions($wrapper)})
        .then(function (options) { s.options = options; }, logError);
  }

  function purge($wrapper, s) {
    debug.log(s.id, "  purge options");
    writeOptions($wrapper, data.defaultOptions);
    return query("admin.settings.update@{Id}Set", {id: s.id, options: data.defaultOptions})
        .then(function (options) { s.options = options; }, logError);
  }

  /*----------------------------------------------------- utils  -----------------------------------------------------*/

  function query(key, data) {
    var d = $.Deferred();
    socket.emit(key, data, function (err, result) { if (err == null) { d.resolve(result); } else { d.reject(err); } });
    return d.promise();
  }

  function logError(err) {
    console.error(err); // TODO alert dialog
    return err;
  }

});
