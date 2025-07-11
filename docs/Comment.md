# Comment Node

The `Comment` node inherits directly from `Node` in PostCSS. This node represents a CSS comment; either inline (`//`) or block (`/* */`).

## Properties

### `inline`

Type: `Boolean`<br>

If `true`, indicates that the type of comment is "inline," or a comment that begins with `//`. If `false`, indicates that the comment is a traditional block comment.

### `text`

Type: `String`<br>

A `String` representation of the body of the comment, with comment markers removed and trimmed.

### `type`

Type: `String`
Value: `'comment'`

### `value`

Type: `String`<br>

A `String` representation of the original comment including comment markers.

## Example Values

```css
// na na na na na na na na batmannnnn
/* joker cheats at poker */
```
