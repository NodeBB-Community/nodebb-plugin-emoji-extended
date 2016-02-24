(function () {
  "use strict";

  define("@{type.name}/@{id}/settings", function () { return $.Deferred(); });

  require(["@{type.name}/@{id}/debug", "@{type.name}/@{id}/settings"], function (debug, settingsDefer) {
    socket.emit("plugins.@{iD}.settings", null, function (err, settings) {
      if (err != null) {
        settingsDefer.reject(err);
        return debug.error(err);
      }
      debug.log("initialize settings", settings);
      settingsDefer.resolve(settings);
    });
  });

})();
