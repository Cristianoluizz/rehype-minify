/**
 * @fileoverview
 *   Remove content of external JavaScript `script` elements.
 * @example
 *   <script src="index.js">Hello!</script>
 */

import {visit} from 'unist-util-visit'
import {isJavaScript} from 'hast-util-is-javascript'
import {hasProperty} from 'hast-util-has-property'

export default function rehypeRemoveExternalScriptContent() {
  return transform
}

function transform(tree) {
  visit(tree, 'element', visitor)
}

function visitor(node) {
  if (isJavaScript(node) && hasProperty(node, 'src')) {
    node.children = []
  }
}
