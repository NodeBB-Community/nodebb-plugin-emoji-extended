define("@{type.name}/@{id}/admin/sets/actions", [
  "@{type.name}/@{id}/debug",
  "@{type.name}/@{id}/admin/sets/data"
], function (debug, data) {
  "use strict";

  var REJECTED = $.Deferred().reject().promise();

  /*==================================================== Exports  ====================================================*/

  return {
    purge: purge,
    update: update,
    activate: activate,
    deactivate: deactivate,

    mayPurge: mayPurge,
    mayUpdate: mayUpdate,
    mayActivate: mayActivate,
    mayDeactivate: mayDeactivate
  };

  /*=================================================== Functions  ===================================================*/

  /*----------------------------------------------- action conditions  -----------------------------------------------*/

  function mayPurge(s) {
    if (!s.prepared || s.static) { return false; }
    for (var i = 0; i < data.active.length; i++) { if (s.id === data.active[i]) { return false; } }
    return true;
  }

  function mayUpdate(s) { return !s.static; }

  function mayActivate(s) {
    if (!s.prepared && !s.static) { return false; }
    for (var i = 0; i < data.active.length; i++) { if (s.id === data.active[i]) { return false; } }
    return true;
  }

  function mayDeactivate(s) {
    for (var i = 0; i < data.active.length; i++) { if (s.id === data.active[i]) { return true; } }
    return false;
  }

  /*----------------------------------------------------- files  -----------------------------------------------------*/

  function update(s) {
    debug.log(s.id, "  update");
    return query("admin.@{iD}.updateSet", s.id).then(function (p) { return updatePrepared(s, p); }, logError);
  }

  function purge(s) {
    if (s.prepared) {
      debug.log(s.id, "  purge");
      return query("admin.@{iD}.purgeSet", s.id).then(function (p) { return updatePrepared(s, p); }, logError);
    }
  }

  function updatePrepared(s, prepared) {
    s.prepared = prepared;
    return s;
  }

  /*-------------------------------------------------- active sets  --------------------------------------------------*/

  function activate(s) {
    if (s.prepared) {
      debug.log(s.id, "  activate");
      data.active.push(s.id);
      return queryActivateSets().then(function () { return s; });
    }
    return REJECTED;
  }

  function deactivate(s) {
    var constantS = function () { return s; };
    for (var i = 0; i < data.active.length; i++) {
      if (data.active[i] === s.id) {
        debug.log(s.id, "  deactivate");
        data.active.splice(i, 1);
        return queryActivateSets().then(constantS);
      }
    }
    return REJECTED;
  }

  function queryActivateSets() { return query("admin.@{iD}.activateSets", data.active).then(putActive, logError); }

  /*------------------------------------------------- installed sets -------------------------------------------------*/

  // TODO

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

  function putActive(ids) { return data.active = ids; }

});
