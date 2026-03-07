# Comment Node

The `Comment` node inherits directly from `Node` in PostCSS. This node represents a CSS block comment (`/* … */`).

## Properties

### `inline`

Type: `Boolean`<br>

Always `false` for CSS values. Inline `//` comments are not part of standard CSS values and are not produced by the parser.

### `text`

Type: `String`<br>

A `String` representation of the body of the comment, with comment markers removed and trimmed.

### `type`

Type: `String`
Value: `'comment'`

### `value`

Type: `String`<br>

The original comment including comment markers, e.g. `/* comment */`.

## Example Values

```css
/* joker cheats at poker */
```
