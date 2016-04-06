(function () {
  "use strict";

  var EMPTY_ARRAY = [];
  var DATA_PROPERTY = "@{id}-strategy";
  var DEFAULT_OPTIONS = {
    zIndex: 20000,
    listPosition: function (position) {
      this.$el.css(this._applyPlacement(position));
      this.$el.css("position", "absolute");
      return this;
    }
  };

  var $window = $(window);
  var completion = null;

  /*================================================= Initialization =================================================*/

  // get completion module to local variable in order to perform synchronous actions later on if ready
  require(["@{type.name}/@{id}/completion"], function (module) {
    module.then(function (module) { completion = module; }, function () { completion = false; });
  });

  // attach handler to NodeBB events to modify auto-completion
  $window.on("composer:autocomplete:init", handleNodeBBEvent);
  $window.on("chat:autocomplete:init", handleNodeBBEvent);

  /*--------------------------------------------------- Functions  ---------------------------------------------------*/

  function handleNodeBBEvent(ignored, data) {
    var $element = data.element;
    if ($element.data(DATA_PROPERTY)) { return; }
    if (completion === null) {
      // completion is not yet ready, add ASAP
      require(["@{type.name}/@{id}/completion"], function (module) {
        module.then(function (module) { module.applyTo($element, data.options); });
      });
    } else if (completion !== false) {
      // completion is ready, use NodeBB way of attachment
      data.strategies.push(completion.strategy);
      $element.data(DATA_PROPERTY, true);
    }
  }

  /*=============================================== Module definition  ===============================================*/

  define("@{type.name}/@{id}/completion", [
    "@{type.name}/@{id}/debug",
    "@{type.name}/@{id}/items",
    "@{type.name}/@{id}/settings",
    "@{type.name}/@{id}/detection"
  ], function (debug, itemsDefer, settingsDefer, detectionDefer) {
    var defer = $.Deferred();

    $.when(itemsDefer, settingsDefer, detectionDefer).then(function (items, settings, detection) {
      var completion = settings.completion, classes = settings.classes, urls = settings.urls;

      if (!completion.enabled) {
        debug.log("completion disabled");
        return defer.reject("Disabled via settings.");
      }

      var regexSource = "^((([\\s\\S]*)(" + completion.prefix + ")):[\\w\\d+-]{" + completion.minChars + ",})$";

      $.each(items.list, function (ignored, emoji) { if (!$.isArray(emoji.aliases)) { emoji.aliases = EMPTY_ARRAY; } });

      var exports = {
        strategy: {
          match: new RegExp(regexSource, "i"),
          search: search,
          replace: function (item) { return "$2:" + item.id + ": "; },
          template: getTemplate,
          maxCount: completion.maxLines,
          index: 1
        },

        getImg: getImg,
        getPath: getPath,
        applyTo: applyTo
      };

      defer.resolve(exports);

      function applyTo($element, options) {
        if (!($element instanceof $)) { $element = $($element); }
        if ($element.data(DATA_PROPERTY)) { return; }
        if (options == null) { options = DEFAULT_OPTIONS; }
        debug.log("apply text-completion", $element, options);
        $element.textcomplete([exports.strategy], options);
        $element.data(DATA_PROPERTY, true);
      }

      function search(text, cb) {
        if (!detection.allowCompletion(text)) { return cb([]); }
        var matcher = text.match(/:([\w\d\+-]*)$/)[1].toLowerCase();
        var list = $.grep(items.list, function (emoji) {
          if (emoji.id.indexOf(matcher) !== -1) { return true; }
          var _len = emoji.aliases.length;
          for (var i = 0; i < _len; i++) { if (emoji.aliases[i].indexOf(matcher) !== -1) { return true; } }
          return false;
        });
        // stable sort by indexOf(matcher)
        $.each(list, function (i, emoji) { emoji.idx = i; });
        list = list.sort(function (a, b) {
          var aMatch = a.id.indexOf(matcher), bMatch = b.id.indexOf(matcher);
          if (aMatch === -1) {
            if (bMatch === -1) { return a.idx - b.idx; } else { return 1; }
          } else {
            if (bMatch === -1) { return -1; } else { return aMatch - bMatch || a.idx - b.idx; }
          }
        });
        return cb(list);
      }

      function getPath(item) {
        var setURL = urls[item.setId];
        var path = "";
        for (var i = 0; i < setURL.length; i++) {
          var entry = setURL[i];
          if (typeof entry === "string") {
            path += entry;
          } else {
            var key = entry.key;
            if (item.hasOwnProperty(key)) {
              path += entry.encode ? encodeURIComponent(item[key]) : item[key];
            } else if (entry.fallback) {
              path += entry.fallback;
            }
          }
        }
        return path;
      }

      function getImg(item, additionalClasses) {
        var c = classes + (additionalClasses ? " " + additionalClasses : "");
        if (item.hasOwnProperty("classes")) { c += " " + item.classes; }
        var img = "<img src=\"" + getPath(item) + "\" class=\"" + c + "\" data-set-id=\"" + item.setId + "\"" +
            " data-emoji-id=\"" + item.id + "\"";
        if (item.hasOwnProperty("width")) { img += " width=\"" + item.width + "\""; }
        if (item.hasOwnProperty("height")) { img += " height=\"" + item.height + "\""; }
        return img + "/>";
      }

      function getTemplate(item) { return getImg(item, "emoji-completion") + " " + item.id; }
    }, function (err) { defer.reject(err); });

    return defer;
  });

})();
