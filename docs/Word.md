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

If `true`, denotes that the word represents a Universal Resource Locator (URL). Note that this is only set to `true` for standalone URLs, not for URLs within function calls like `url()`.

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

The Word node has special handling for URLs that appear outside of function contexts. When a standalone URL is encountered in a CSS value, it is parsed as a Word node with the `isUrl` property set to `true`. This is different from URLs that appear within `url()` functions.

```js
const { parse } = require('postcss-values-parser');

const root = parse('https://example.com');
const wordNode = root.nodes[0];

console.log(wordNode.type); // 'word'
console.log(wordNode.isUrl); // true
console.log(wordNode.value); // 'https://example.com'
```

Note: URLs within `url()` functions are handled differently and create `Func` nodes instead of `Word` nodes.


