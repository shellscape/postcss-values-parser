# AtWord Node

The `UnicodeRange` node inherits directly from `Node` in PostCSS. This node represents a valid unicode range declaration.

## Properties

### `type`
Type: `String`
Value: `'unicodeRange'`

### `name`
Type: `String`<br>

A `String` representation of the unicode range specified.

## Example Values

```css
  U+26
  U+0-7F
  U+0025-00FF
  U+4??
  U+0025-00FF
  U+4??
```
