# Numeric Node

The `Numeric` node inherits directly from `Node` in PostCSS. This node represents a numeric value, with or without designated CSS units.

## Properties

### `type`

Type: `String`
Value: `'numeric'`

### `unit`

Type: `String`<br>

The unit of the numeric figure, if one was used. For dimensions, this contains the unit (e.g., `px`, `em`, `rem`). For percentages, this contains `%`. For plain numbers, this is an empty string. Valid units include: `%, ch, cm, em, ex, in, mm, pc, pt, px, rem, vh, vmax, vmin, vw`.

### `value`

Type: `String`<br>

A `String` representation of the numeric figure. For dimensions, this contains only the numeric value without the unit. For plain numbers, this contains only the numeric value. For percentages, this contains the numeric value followed by the `%` symbol.

## Example Values

```css
  .23rem
  0.5
  -0.5
  2.
  +2
  -2
  5/5
  5 +5
  5 + 5
  -2px
  -16px
  -16px -1px -1px -16px
  1e10
  1E10
  1e-10
  1E-10
  1e+10
  1E+10
  -.567800E-0012780em
  .1E-10
  .1E+10
```
