# Func Node

The `Func` node inherits directly from `Container` in PostCSS. This node represents a function call within a value. If the function call contains arguments, those arguments will be represented as parsed child nodes.

## Properties

### `isColor`

Type: `Boolean`<br>

If `true`, denotes that the function represents a color-producing function. Valid color-producing functions are: `hsl()`, `hsla()`, `rgb()`, and `rgba()`.

### `isVar`

Type: `Boolean`<br>

If `true`, denotes that the function represents a CSS variable usage function. Valid var function is: `var( <custom-property-name> , <declaration-value>? )`.

### `name`

Type: `String`<br>

The name of the function.

### `params`

Type: `String`<br>

A `String` representation of the body of the function, between parenthesis, including the parenthesis characters. This value will be parsed and the result placed into the `nodes` property. This value should be considered only a snapshot for reference. To manipulate function parameters, please leverage the `Container.nodes` property.

### `type`

Type: `String`
Value: `'func'`

## Example Values

```css
  url(http://bat.cave)
  rgba(255, 255, 255, 0)
  calc(-0.5 * var(foo))
  -webkit-linear-gradient(0)
```
