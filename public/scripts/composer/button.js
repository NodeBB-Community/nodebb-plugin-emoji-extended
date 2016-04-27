$(window).on("action:composer.enhanced", function () {
  "use strict";

  require(["composer/formatting"], function (composer) {
    composer.addButtonDispatch("@{id}", function (textarea, selectionStart, selectionEnd) {
      require(["@{type.name}/@{id}/composer/modal"], function (modal) {
        modal.openAndInsert(textarea, selectionStart, selectionEnd);
      });
    });
  });
});
