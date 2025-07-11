# Func Node

The `Func` node inherits from `Container` in PostCSS. This node represents a function call within a value. If the function call contains arguments, those arguments will be represented as parsed child nodes.

## Properties

### `isColor`

Type: `Boolean`<br>

If `true`, denotes that the function represents a color-producing function. Valid color-producing functions are: `hsl()`, `hsla()`, `hwb()`, `lab()`, `lch()`, `oklab()`, `oklch()`, `rgb()`, and `rgba()`.

### `isVar`

Type: `Boolean`<br>

If `true`, denotes that the function represents a CSS variable usage function. Valid var function is: `var( <custom-property-name> , <declaration-value>? )`.

### `name`

Type: `String`<br>

The name of the function.

### `params`

Type: `String`<br>

A `String` representation of the function parameters. This property is initialized as an empty string and should be considered a placeholder. The actual function parameters are parsed and stored as child nodes in the `nodes` property. To access function parameters, use the `Container.nodes` property.

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
