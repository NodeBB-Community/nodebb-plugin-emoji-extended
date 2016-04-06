require(["composer/formatting"], function (composer) {
  "use strict";

  composer.addButtonDispatch("@{id}", function (textarea, selectionStart, selectionEnd) {
    require(["@{type.name}/@{id}/composer/modal"], function (modal) {
      modal.openAndInsert(textarea, selectionStart, selectionEnd);
    });
  });
});
