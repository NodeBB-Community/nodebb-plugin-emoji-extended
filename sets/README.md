If you want to publish a custom set you need to create a NodeBB plugin with peer dependency `nodebb-plugin-emoji-extended`.

The recommended way of registering the set (and logging an error when peer emoji-extended is missing):

    var winston = require("winston");
    var setsCtrl = null;

    try {
      setsCtrl = require("nodebb-plugin-emoji-extended/lib/sets/controller");
    } catch (e) {
      winston.error("[plugins/emoji] nodebb-plugin-emoji-extended is not installed. nodebb-plugin-my-plugin depends on it.");
    }

    if (setsCtrl != null) { setsCtrl.register(require("./path/to/set/module"), "my-set"); }

Where the set module may provide the following properties:

* `[(Object|String)[]] url` - Definition of path for templates within auto-completion (explanation below).
* `[String] name` - The name of the set. Shown within ACP.
* `[String] preview` - URL to a preview image of the set. Used within ACP.
* `[{id: RegExp[]|RegExp}] mapping.separationLeading` - RegExp(s) to replace with emoji (with leading word-boundary required for match).
* `[{id: RegExp[]|RegExp}] mapping.separationWrapped` - RegExp(s) to replace with emoji (with leading and trailing word-boundary required for match).
* `[String] license` - License details to be shown within emoji modal legal information tab.
* `[String] moduleId` - The ID of your plugin (NPM package name). Shown within ACP.
* `[String, HTML] description` - The description of the set. Shown within ACP.
* `[String, HTML] attribution` - Attribution to be shown within emoji modal legal information tab.
* `[String, CSS] mainStyles` - Styles to use within frontend.
* `[String, CSS] emailStyles` - Styles to use within emails.
* `[Boolean] prepared` - If false, an update is required before activation.
 
* `[Emoji[]] use(options)` - Called when set should get activated.
* `[Emoji[]] update()` - Called to update the image files (if not set, the set is treated static).
* `[String] parse(text)` - Called to parse a plain text and replace emoji occurrences with HTML.
* `[void] purge()` - Called to remove image files (only recommended if reversible via `update`).

The attributes `name`, `use` and `parse` must be set when needed (e.g. `parse` is not needed before `use` is resolved).
The functions `use`, `update` and `purge` may also return a `Promise` to resolve asynchronously.
The properties `url`, `preview`, `mapping`, `description`, `attribution`, `mainStyles`, `emailStyles` and `prepared` may as well be function returning the required value.

The array items of `url` get concatenated to resolve the URL for an image at client-side (needed for auto-completion).
Objects within the `url` array must provide a `[String] key` property (e.g. `id` or `file`) which gets resolved to that attribute of the `Emoji` (only properties as described below get resolved).
If it provides `[Boolean] encode` set to `true`, the property gets URI-encoded.
If property `key` cannot be resolved and a `[String] fallback` is specified, this gets used instead.

An `Emoji` object is required to provide at least `[String] id`.
It may also provide the following attributes:

* `[String[]] aliases` - Aliases for the emoji.
* `[String] category` - The category of the emoji (within emoji modal, default: `"others"`).
* `[String] file` - The filename of the emoji (if it differs from the id).
* `[String] classes` - Extra class names for the emoji.
* `[Number] width` - Width for the emoji in pixels (gets added to generated `img` tags).
* `[Number] height` - Height for the emoji in pixels (gets added to generated `img` tags).


Some *official* sets for further help:
 * [nodebb-plugin-emoji-one](https://github.com/NodeBB-Community/nodebb-plugin-emoji-one) - Example of image files being kept up-to-date with online zip archive, featuring `Emoji.file` usage.
 * [nodebb-plugin-emoji-static](https://github.com/NodeBB-Community/nodebb-plugin-emoji-static) - User defined images.
 * [nodebb-plugin-emoji-cubicopp](https://github.com/NodeBB-Community/nodebb-plugin-emoji-cubicopp) - Example of static image files.
 * [nodebb-plugin-emoji-apple](https://github.com/NodeBB-Community/nodebb-plugin-emoji-apple) - Example of image files being kept up-to-date with a GitHub repository.
