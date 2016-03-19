define("@{type.name}/@{id}/composer/modal", [
  "@{type.name}/@{id}/debug",
  "@{type.name}/@{id}/items",
  "@{type.name}/@{id}/settings",
  "@{type.name}/@{id}/completion",
  "composer/controls",
  "translator"
], function (debug, itemsDefer, settingsDefer, completionDefer, composer, translator) {
  "use strict";
  var OTHERS = "others";

  var initialized = $.Deferred();

  /*================================================= Initialization =================================================*/

  /*------------------------------------------------ Categorize items ------------------------------------------------*/

  itemsDefer.then(function (items) {
    var categories = [];
    var itemsByCategory = {};
    $.each(items.list, function (ignored, item) {
      var category = item.category || OTHERS;
      if (itemsByCategory.hasOwnProperty(category)) {
        itemsByCategory[category].push(item);
      } else {
        itemsByCategory[category] = [item];
        categories.push(category);
      }
    });
    categories.sort(function (c1, c2) {
      return c1 === OTHERS ? 1 : c2 === OTHERS ? -1 : c1 < c2 ? -1 : 1;
    });
    categories = $.map(categories, function (category) {
      return {title: category, items: itemsByCategory[category]};
    });
    debug.log("categorization complete", categories);
    initialized.resolve(categories);
  }, function (err) { initialized.reject(err); });

  /*==================================================== Exports  ====================================================*/

  return {open: showModal};

  /*=================================================== Functions  ===================================================*/

  function showModal($textarea, selectionStart, selectionEnd) {
    debug.log("modal requested");
    var titleDefer = $.Deferred();
    translator.translate("[[@{iD}:modal.title]]", function (title) { titleDefer.resolve(title); });

    return $.when(initialized, settingsDefer, completionDefer, titleDefer)
        .then(function (categories, settings, completion, title) {
          var $bootbox = bootbox.dialog({
            size: "large",
            title: title,
            message: getModalContent(categories, settings, completion, emojiAction),
            onEscape: true
          });
          $bootbox.addClass("@{id}-modal");
          debug.log("modal ready");

          function emojiAction(item) {
            $bootbox.modal("hide");
            var text = ":" + item.id + ": ";
            var newSelectionEnd = selectionEnd + text.length;
            var newSelectionStart = selectionStart === selectionEnd ? newSelectionEnd : selectionStart;
            composer.updateTextareaSelection($textarea, selectionEnd, selectionEnd);
            composer.insertIntoTextarea($textarea, text);
            composer.updateTextareaSelection($textarea, newSelectionStart, newSelectionEnd);
            $textarea.trigger("input");
          }
        });
  }

  function getModalContent(categories, settings, completion, onClick) {
    var $wrapper = getModalTabbedContent(categories, settings, completion);
    $wrapper.on("click", ".emoji-link", function () { onClick($(this).data("item")); });
    return $wrapper;
  }

  function getModalTabbedContent(categories, settings, completion) {
    var $wrapper = $("<div class=\"tabbable\"></div>");
    var $navigation = $("<ul class=\"nav nav-tabs\" role=\"tablist\"></ul>").appendTo($wrapper);
    var $content = $("<div class=\"tab-content\"></div>").appendTo($wrapper);
    $.each(categories, function (i, category) {
      var title = category.title;
      //noinspection HtmlUnknownAnchorTarget
      var $navLink = $("<a href=\"#emoji-" + title + "\" data-toggle=\"tab\">" + title + "</a>");
      var $navItem = $("<li></li>").append($navLink).appendTo($navigation);
      var $contentItem = getCategoryContent(category, completion)
          .addClass("tab-pane fade")
          .appendTo($content);
      translator.translate("[[emojiCategories:" + title + "]]", function (text) { $navLink.text(text); });
      if (i === 0) {
        $navItem.addClass("active");
        $contentItem.addClass("active in");
      }
    });
    addLegalInfo($navigation, $content, settings);
    return $wrapper;
  }

  function getCategoryContent(category, completion) {
    var $content = $("<div id=\"emoji-" + category.title + "\" class=\"emoji-container row\"></div>");
    var items = category.items;
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      $("<a class=\"emoji-link col-xs-6 col-md-3\" title=\"" + item.id + "\"></a>")
          .append(completion.getImg(item, "emoji-presentation") + " :" + item.id + ":")
          .data("item", item)
          .appendTo($content);
    }
    return $content;
  }

  function addLegalInfo($navigation, $content, settings) {
    var legal = settings.legal;
    if (!legal.length) { return; }
    var $navLink = $("<a href=\"#emoji-legal\" data-toggle=\"tab\">Legal Information</a>");
    $("<li></li>").append($navLink).appendTo($navigation);
    getLegalContent(legal, settings.sets > 1)
        .addClass("tab-pane fade")
        .appendTo($content);
    translator.translate("[[@{iD}:modal.legal]]", function (text) { $navLink.text(text); });
  }

  function getLegalContent(legal, multiSets) {
    var $wrapper = $("<div id=\"emoji-legal\"></div>");
    if (multiSets) {
      translator.translate("[[@{iD}:modal.legal.header]]", function (text) {
        $("<p>" + text + "</p>").prependTo($wrapper);
      });
    }
    for (var i = 0; i < legal.length; i++) { getLegalPanel(legal[i], multiSets).appendTo($wrapper); }
    return $wrapper;
  }

  function getLegalPanel(legal, pane) {
    var $panel = $("<div id=\"emoji-legal-" + legal.setId + "\" class=\"emoji-legal-container\"></div>");
    if (pane) {
      var $heading = $("<div class=\"panel-heading\">Images of the set '" + legal.setId + "'</div>").appendTo($panel);
      translator.translate("[[@{iD}:modal.legal.set.header," + legal.setId + "]]", function (text) {
        $heading.html(text);
      });
    }
    var $body = $("<div></div>").appendTo($panel);
    var $el;
    if (legal.attribution != null) {
      var $attributionTitle = $("<h4></h4>").appendTo($body);
      translator.translate("[[@{iD}:modal.legal.set.attribution]]", function (text) { $attributionTitle.text(text); });
      $el = $("<p class=\"legal-attribution well well-sm\"></p>").appendTo($body);
      $el.append(legal.attribution);
    }
    if (legal.license != null) {
      var $licenseTitle = $("<h4></h4>").appendTo($body);
      translator.translate("[[@{iD}:modal.legal.set.license]]", function (text) { $licenseTitle.text(text); });
      $el = $("<p class=\"legal-license well well-sm\"></p>").appendTo($body);
      $el.append(legal.license);
    }
    if (pane) {
      $panel.addClass("panel panel-default");
      $body.addClass("panel-body");
    }
    return $panel;
  }

});
