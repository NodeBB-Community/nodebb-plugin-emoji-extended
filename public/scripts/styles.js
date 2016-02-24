(function () {
  "use strict";

  define("@{type.name}/@{id}/styles", ["@{type.name}/@{id}/debug"], function (debug) {
    var exports = {
      style: "",
      element: $("<style type=\"text/css\" id=\"styles-@{id}\"></style>"),
      append: function (style) {
        debug.log("append style", style);
        exports.style += (exports.style ? "\n" : "") + style;
        exports.element.html(exports.style);
      }
    };

    return exports;
  });

  require(["@{type.name}/@{id}/debug", "@{type.name}/@{id}/styles"], function (debug, styles) {
    socket.emit("plugins.@{iD}.styles", null, function (err, style) {
      if (err != null) { debug.error(err); }

      style = ".emoji { display: inline-block; }\n" + (style || "");
      styles.append(style);
      $(document).ready(function () { styles.element.appendTo("head"); });
    });
  });

})();
