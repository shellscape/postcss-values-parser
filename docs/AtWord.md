# AtWord Node

The `AtWord` node inherits directly from `AtRule` in PostCSS, and is purely cosmetic. Rules don't exist within CSS property values, so the class was created to properly describe a word in which the `@` prefixed it.

## Properties

### `name`

Type: `String`<br>

The portion of the at-word which identifies it, minus the leading `@` character.

### `type`

Type: `String`
Value: `'atword'`

## Example Values

```css
@batman @color;
```

_Note: Using the `variables` property, `AtWords` may instead be treated as variables._
