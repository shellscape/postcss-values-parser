# Quoted Node

The `Quoted` node inherits directly from `Node` in PostCSS. This node represents a quoted string in a CSS value.

## Properties

### `quote`
Type: `String`<br>

The quotation character used to denote the beginning and end of the string.

### `type`
Type: `String`
Value: `'quoted'`

### `value`
Type: `String`<br>

The value of the string between the quote characters, *including* quotes.

### `contents`
Type: `String`<br>

The value of the string between the quote characters, *without* quotes.

## Example Values

```css
  'batman'
  "joker"
```
