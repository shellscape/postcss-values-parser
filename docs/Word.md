# Word Node

The `Word` node inherits directly from `Node` in PostCSS. This node is a catch-all for values which start with word-characters, or for certain types of words with special decorations, such as variables and colors.

## Properties

### `isColor`
Type: `Boolean`<br>

If `true`, denotes that the word represents a color.

### `isHex`
Type: `Boolean`<br>

If `true`, denotes that the word represents a hexadecimal value.

### `isVariable`
Type: `Boolean`<br>

If `true`, denotes that the word represents a CSS variable.

### `type`
Type: `String`
Value: `'word'`

### `value`
Type: `String`<br>

The value of the word.

## Example Values

```css
  bold
  min-width
  --color
  -webkit-transition
  #fff
```


this.isColor = false;
this.isHex = false;
this.isVariable = false;
