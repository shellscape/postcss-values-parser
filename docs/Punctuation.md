# Punctuation Node

The `Punctuation` node inherits directly from `Node` in PostCSS. This node represents punctuation characters in CSS values. In v7, most separators (like commas) are represented as `operator` nodes by the parser, and parentheses are represented by `parentheses` nodes. `Punctuation` nodes are uncommon in typical value parsing and may not appear for many inputs.

## Properties

### `type`

Type: `String`
Value: `'punctuation'`

### `value`

Type: `String`<br>

A `String` representation of the punctuation character.
