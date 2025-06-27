# Interpolation Node

The `Interpolation` node inherits directly from `Container` in PostCSS. This node represents an interpolation declaration found in CSS-like dialects such as LESS and SCSS. The body of the interpolation is represented as parsed child nodes.

## Properties

### `type`

Type: `String`
Value: `'interpolation'`

### `params`

Type: `String`<br>

A `String` representation of the body of the interpolation statement. This value will be parsed and the result placed into the `nodes` property.

### `prefix`

Type: `String`<br>

A `String` representation of the first/signifying character of the interpolation statement.

## Example Values

```scss
  // scss
  #{batman}
  #{2px}
  #{2 * 2px}
```

```less
  // less
  .@{my-selector}
```
