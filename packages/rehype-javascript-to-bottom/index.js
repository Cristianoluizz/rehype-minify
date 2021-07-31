/**
 * @fileoverview
 *   Move JS `<script>` elements to the end of `<body>`.
 *
 *   This can *decrease* the time to
 *   [first render](https://developer.yahoo.com/performance/rules.html#js_bottom).
 *
 *   You can pass `filter`, a function called with each checked node, returning
 *   `true` if the script should be moved, and `false` if not.
 * @example {"processor": {"fragment": false}}
 *
 *   <!doctype html><html><head><script src="index.js"></script></head><body></body></html>
 */

import {visit} from 'unist-util-visit'
import {isJavaScript} from 'hast-util-is-javascript'

export default function rehypeJavaScriptToBottom(options) {
  var settings = options || {}
  var filter = settings.filter || yes

  return transform

  function transform(tree) {
    var matches = []
    var body

    visit(tree, 'element', visitor)

    if (body && matches.length !== 0) {
      move()
    }

    function visitor(node, index, parent) {
      if (node.tagName === 'body') {
        body = node
      }

      if (isJavaScript(node) && filter(node)) {
        matches.push([parent, node])
      }
    }

    function move() {
      var length = matches.length
      var index = -1
      var match
      var siblings

      while (++index < length) {
        match = matches[index]
        siblings = match[0].children
        siblings.splice(siblings.indexOf(match[1]), 1)
        body.children.push(match[1])
      }
    }
  }
}

function yes() {
  return true
}
