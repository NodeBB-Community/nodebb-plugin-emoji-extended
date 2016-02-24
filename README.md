# [NodeBB](https://nodebb.org/) Plugin: **Emoji Extended** *\<nodebb-plugin-emoji-extended>*

[![License](https://img.shields.io/npm/l/nodebb-plugin-emoji-extended.svg)](LICENSE)
[![Version](https://img.shields.io/npm/v/nodebb-plugin-emoji-extended.svg)](https://www.npmjs.com/package/nodebb-plugin-emoji-extended)
[![Downloads](https://img.shields.io/npm/dm/nodebb-plugin-emoji-extended.svg)](https://www.npmjs.com/package/nodebb-plugin-emoji-extended)
[![Dependency Status](https://david-dm.org/NodeBB-Community/nodebb-plugin-emoji-extended.svg)](https://david-dm.org/NodeBB-Community/nodebb-plugin-emoji-extended)

Adds extended functionality of Emoji into NodeBB.

 * Activate multiple sets of emoji.
 * Update image files of any set with a single click.
 * Use the already existing sets or add custom ones (either private via static files or public by creating a new set).
 * Intelligent auto-completion of available emoji for the end-user.
    + Supports markdown specific code-block detection.
 * Enable mapping of common texts like `:-)`.
 * View all activated emoji within a dialog.

## Installation

To ensure compatibility with your NodeBB instance you should install `nodebb-plugin-emoji-extended` via the NodeBB Admin Control Panel.

### Emoji sets

The following sets are approved of being well integrated with `nodebb-plugin-emoji-extended`:

 * [nodebb-plugin-emoji-one](https://github.com/NodeBB-Community/nodebb-plugin-emoji-one)
 * [nodebb-plugin-emoji-static](https://github.com/NodeBB-Community/nodebb-plugin-emoji-static)
 * [nodebb-plugin-emoji-cubicopp](https://github.com/NodeBB-Community/nodebb-plugin-emoji-cubicopp)
 * [nodebb-plugin-emoji-apple](https://github.com/NodeBB-Community/nodebb-plugin-emoji-apple)

Each one should be installed alike using the NodeBB Admin Control Panel in order to ensure compatibility with your NodeBB instance.

### Manual installation

The manual installation via [NPM](https://www.npmjs.com/) may result in version-conflicts with NodeBB.

    npm install nodebb-plugin-emoji-extended

## Development

This module gets developed using the [NodeBB Grunt](https://github.com/NodeBB-Community/nodebb-grunt) Framework.
