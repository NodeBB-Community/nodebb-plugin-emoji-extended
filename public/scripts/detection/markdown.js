define("@{type.name}/@{id}/detection/markdown", function () {
  "use strict";
  var REGEX_EMPTY = /^\s*$/;
  var REGEX_LIST = /^( {0,3})[\+*-]\s/;
  var REGEX_CODE_BLOCK = /^ {4,}| {0,3}\t/;
  var REGEX_IGNORE_INLINE = /^\s+`*$/;

  return {allowCompletion: allowCompletion};

  function isInlineCodeContext(line) {
    var beginSize = 0, currentSize = 0;
    var escaped = false, begin = true;
    var since = "";
    for (var i = 0; i < line.length; i++) {
      var char = line[i];
      if (char === "`" && !(escaped && begin) && !REGEX_IGNORE_INLINE.test(since)) {
        if (begin) {
          beginSize++;
        } else {
          currentSize++;
          since += char;
        }
      } else if (currentSize === beginSize && beginSize) {
        beginSize = currentSize = 0;
        begin = true;
        since = "";
      } else {
        if (begin && beginSize) { begin = false; }
        since += char;
        currentSize = 0;
      }
      escaped = char === "\\";
    }
    return beginSize;
  }

  function codeInListRegex(indent) {
    if (indent === 3) {
      return /^( {8}\s|( {0,3}\t){2}\s| {0,3}\t {4}\s| {4,7}\t\s)/;
    } else {
      return new RegExp("^( {" + (indent + 6) + "}|( {0,3}\\t){2}| {0,3}\\t( {0," + (indent + 2) + "})| {4,7}\\t)");
    }
  }

  function isBlockCodeContext(lines) {
    var list = false, code = false;
    var prevEmpty = true;
    var codeInList = null;
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i], l;
      var empty = REGEX_EMPTY.test(line);
      list = list && !(prevEmpty && empty);
      if (l = line.match(REGEX_LIST)) {
        list = true;
        codeInList = codeInListRegex(l[1].length);
      }
      code = list && codeInList.test(line) || !list && (prevEmpty || code) && REGEX_CODE_BLOCK.test(line);
      prevEmpty = empty;
    }
    return code;
  }

  /**
   * @param prefix The text to check.
   * @returns {boolean} true iff the end of the text cannot be within code-context (no possible suffix).
   */
  function allowCompletion(prefix) {
    var lines = prefix.split("\n");
    return !(isInlineCodeContext(lines[lines.length - 1]) || isBlockCodeContext(lines));
  }
});
