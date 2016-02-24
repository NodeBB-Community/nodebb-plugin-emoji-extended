(function () {
  "use strict";

  define("@{type.name}/@{id}/detection", function () { return $.Deferred(); });

  require(["@{type.name}/@{id}/debug", "@{type.name}/@{id}/detection"], function (debug, detectionDefer) {
    socket.emit("plugins.@{iD}.parserPlugin", null, function (err, parserPlugin) {
      if (err != null) { debug.error(err); }

      var parser;
      switch (parserPlugin) {
        case "nodebb-plugin-markdown":
          parser = "markdown";
          break;
        default:
          parser = "plain";
          break;
      }
      debug.log("initialize detection", parser, parserPlugin);

      require(["@{type.name}/@{id}/detection/" + parser], function (detection) {
        detectionDefer.resolve(detection);
      });
    });
  });

})();
