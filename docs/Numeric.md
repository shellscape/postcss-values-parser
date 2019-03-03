# Numeric Node

The `Numeric` node inherits directly from `Node` in PostCSS. This node represents a numeric value, with or without designated CSS units.

## Properties

### `type`
Type: `String`
Value: `'numeric'`

### `unit`
Type: `String`<br>

The unit of the numeric figure, if one was used. Valid units are: `%, ch, cm, em, ex, in, mm, pc, pt, px, rem, vh, vmax, vmin, vw`.

### `value`
Type: `String`<br>

A `String` representation of the numeric figure, without unit.

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
