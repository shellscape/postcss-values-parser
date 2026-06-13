# Word Node

The `Word` node inherits directly from `Node` in PostCSS. This node is a catch-all for values which start with word-characters, or for certain types of words with special decorations, such as variables and colors.

## Properties

### `isColor`

Type: `Boolean`<br>

If `true`, denotes that the word represents a color.

### `isHex`

Type: `Boolean`<br>

If `true`, denotes that the word represents a hexadecimal value.

### `isUrl`

Type: `Boolean`<br>

If `true`, denotes that the word represents a URL value. This includes URL values that originate from `url(...)`.

### `isParseableUrl`

Type: `Boolean`<br>

If `true`, denotes that the word's value is recognized as a parseable URL by [`is-url-superb`](https://www.npmjs.com/package/is-url-superb).

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
  https://example.com
```

## URL Handling

URL values are represented as `Word` nodes. Use `isUrl` to determine whether a `Word` is a URL value, and use `isParseableUrl` to determine whether the URL string itself is parseable.

For `url(...)`, quoted and unquoted absolute URLs normalize to the same `value`.

```js
import { parse } from 'postcss-values-parser';

const unquotedAbsolute = parse('url(https://example.com/image.png)').nodes[0];
const quotedAbsolute = parse("url('https://example.com/image.png')").nodes[0];
const relative = parse('url(/images/image.png)').nodes[0];

console.log(unquotedAbsolute.value === quotedAbsolute.value); // true
console.log(unquotedAbsolute.isUrl); // true
console.log(unquotedAbsolute.isParseableUrl); // true

console.log(quotedAbsolute.isUrl); // true
console.log(quotedAbsolute.isParseableUrl); // true

console.log(relative.isUrl); // true
console.log(relative.isParseableUrl); // false
```
