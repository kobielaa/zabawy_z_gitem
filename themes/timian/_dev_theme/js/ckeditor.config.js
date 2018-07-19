/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

"use strict";

CKEDITOR.editorConfig = function(config) {
  CKEDITOR.dtd.$removeEmpty.i = 0;
  CKEDITOR.dtd.$removeEmpty['span'] = false;
};