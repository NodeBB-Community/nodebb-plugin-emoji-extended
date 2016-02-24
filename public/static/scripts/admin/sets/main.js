$(document).ready(function () {
  "use strict";
  require(["@{type.name}/@{id}/admin/sets/container"], function (container) {
    container.init();
    container.updateActive();
  });
});
