(function () {
  "use strict";

  define("@{type.name}/@{id}/items", function () { return $.Deferred(); });

  require(["@{type.name}/@{id}/debug", "@{type.name}/@{id}/items"], function (debug, itemsDefer) {
    socket.emit("plugins.@{iD}.emojiList", null, function (err, list) {
      if (err != null) {
        debug.error(err);
        list = [];
      }
      debug.log("initialize list", list);

      var exports = {
        list: list,

        getItem: getItem,
        update: update
      };

      itemsDefer.resolve(exports);

      function getItem(id, setId) {
        var l = list.list;
        for (var i = 0; i < l.length; i++) {
          var item = l[i];
          if (item.id === id && item.setId === setId) { return item; }
        }
        return null;
      }

      function update(list) {
        debug.log("update list", list);
        exports.list = list;
      }
    });
  });

})();
