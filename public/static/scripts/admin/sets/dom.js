define("@{type.name}/@{id}/admin/sets/container", [
  "@{type.name}/@{id}/debug",
  "@{type.name}/@{id}/admin/sets/data",
  "@{type.name}/@{id}/admin/sets/actions"
], function (debug, data, actions) {
  "use strict";

  var busy = {};

  // find static DOM elements
  var $activeTemplate = $("#active-set-template").find(".set-container");
  var $activeSection = $("#active-sets-section");
  var $activeBlock = $("#active-sets-container");
  var $availableBlock = $("#available-sets-container");
  var $installBlock = $("#install-sets-container");

  // generate action functions
  var purge = filesModifyGen(actions.mayPurge, actions.purge);
  var update = filesModifyGen(actions.mayUpdate, actions.update);
  var activate = activeSetsModifyGen(actions.mayActivate, actions.activate);
  var deactivate = activeSetsModifyGen(actions.mayDeactivate, actions.deactivate);

  /*==================================================== Exports  ====================================================*/

  return {
    init: prepareAllContainer,
    updateActive: refreshInstalledContainers
  };

  /*=================================================== Functions  ===================================================*/

  /*------------------------------------------------- attach actions -------------------------------------------------*/

  function prepareAllContainer() {
    $activeBlock.find(".active-set-container").each(prepareActiveContainer);
    $availableBlock.find(".available-set-container").each(prepareAvailableContainer);
    $installBlock.find(".install-set-container").each(prepareInstallContainer);
  }

  function prepareActiveContainer(ignored, container) {
    var $container = $(container);
    var setId = $container.data("set-id"), s = getInstalledSetData(setId);

    $container.find(".set-deactivate").removeAttr("disabled").click(function (e) { deactivate($(e.target), s); });

    return $container;
  }

  function prepareAvailableContainer(ignored, container) {
    var $container = $(container);
    var setId = $container.data("set-id"), s = getInstalledSetData(setId);

    $container.find(".set-update").removeAttr("disabled").click(function (e) { update($(e.target), s); });
    $container.find(".set-activate").click(function (e) { activate($(e.target), s); });
    $container.find(".set-purge").click(function (e) { purge($(e.target), s); });
    // TODO add uninstall action

    if (s.prepared) { $container.find(".set-activate,.set-purge").removeAttr("disabled"); }

    return $container;
  }

  function prepareInstallContainer(ignored, container) {
    var $container = $(container);

    // TODO add install action

    return $container;
  }

  /*---------------------------------------------------- actions  ----------------------------------------------------*/

  //--- files

  function filesModifyGen(check, fn) {
    return function ($btn, s) {
      if (busy[s.id] || !check(s)) { return; }
      markBusy($btn, s);
      return fn(s).always(function () { markReady($btn, s); });
    };
  }

  //--- active sets

  function activeSetsModifyGen(check, fn) {
    return function ($btn, s) {
      if (busy[s.id] || !check(s)) { return; }
      markBusy($btn, s);
      /* Toggle to get a 2s delay on [de]activation queries
       var delay = $.Deferred();
       setTimeout(function () { delay.resolve(s); }, 2000);
       return delay.then(fn).then(refreshAvailableBlock).always(function () { markReady($btn, s); });
       /*/
      return fn(s).then(refreshAvailableBlock).always(function () { markReady($btn, s); });
      //*/
    };
  }

  function refreshAvailableBlock(s) {
    $availableBlock.find(".set-container.hidden").each(function (ignored, el) { $(el).removeClass("hidden"); });
    refreshInstalledContainers();
    return s;
  }

  /*------------------------------------------------ container switch ------------------------------------------------*/

  function refreshInstalledContainers() {
    $activeBlock.children().remove();
    if (!data.active.length) { return $activeSection.addClass("hidden"); }

    for (var i = 0; i < data.active.length; i++) {
      var id = data.active[i];
      $availableBlock.find(".set-container[data-set-id=\"" + id + "\"]").addClass("hidden");
      $activeBlock.append(createActiveContainer(i, getInstalledSetData(id)));
    }

    $activeSection.removeClass("hidden");
  }

  function createActiveContainer(i, s) {
    var $container = $activeTemplate.clone().attr("data-set-id", s.id);

    $container.find(".description").html(s.description || "");
    $container.find(".panel-heading").html(s.name + " <small>" + s.module + "</small>");

    if (s.preview) {
      $container.find(".preview-block > img").attr("src", s.preview);
      $container.find(".description-container").addClass("col-sm-7");
      $container.find(".description").removeClass("no-margin-bottom");
    } else {
      $container.find(".preview-container").remove();
    }

    if (s.static) {
      $container.find(".update-container").remove();
    } else {
      $container.find(".set-update").removeAttr("disabled").click(function (e) { update($(e.target), s); });
    }

    return prepareActiveContainer(i, $container);
  }

  /*----------------------------------------------------- utils  -----------------------------------------------------*/

  function getInstalledSetData(setId) {
    var installed = data.installed;
    for (var i = 0; i < installed.length; i++) {
      var s = installed[i];
      if (s.id === setId) { return s; }
    }
  }

  function markBusy($btn, s) {
    busy[s.id] = true;
    debug.log(s.id, "[busy]");

    var $icon = $btn.find(".fa");
    $icon.data("restore-class", $icon.attr("class")).attr("class", "fa fa-fw fa-spin fa-spinner");

    $(".set-container[data-set-id=\"" + s.id + "\"]")
        .addClass("busy")
        .find(".set-action")
        .each(function (i, el) { setDisabled($(el), true); });
  }

  function markReady($btn, s) {
    var $icon = $btn.find(".fa");
    $icon.attr("class", $icon.data("restore-class")).removeData("restore-class");

    var mayActivate = actions.mayActivate(s);
    var mayPurge = actions.mayPurge(s);
    var mayDeactivate = actions.mayDeactivate(s);
    var mayUpdate = actions.mayUpdate(s);

    var $container = $(".set-container[data-set-id=\"" + s.id + "\"]").removeClass("busy");
    $container.find(".set-activate").each(function (i, el) { setDisabled($(el), !mayActivate); });
    $container.find(".set-purge").each(function (i, el) { setDisabled($(el), !mayPurge); });
    $container.find(".set-deactivate").each(function (i, el) { setDisabled($(el), !mayDeactivate); });
    $container.find(".set-update").each(function (i, el) { setDisabled($(el), !mayUpdate); });

    debug.log(s.id, "[/busy]");
    delete busy[s.id];
  }

  function setDisabled($el, value) { if (value) { $el.attr("disabled", ""); } else { $el.removeAttr("disabled"); } }

});
