# Exported Methods

This module exports the following methods:

### `parse(css, options)`

Returns: `Root<Node>`<br>

Parses a given `String` and returns an AST with a `Root` node. If the input is an invalid CSS value, a `CSSSyntaxError` is thrown.

#### Parameters

#### `css`

Type: `String`<br>
_Required_

#### `options`

Type: `Object`

##### Properties

##### `ignoreUnknownWords`

Type: `Boolean`<br>
Default: `false`

If `true`, will allow all unknown parts of the value to be parsed and added to the AST. Similar functionality in the previous version went by the `loose` option name. If `false`, unknown values will throw `CssSyntaxError`.

##### `interpolation`

Type: `Boolean|Object`<br>
Default: `false`

Set this option to enable parsing of interpolated values for languages such as SCSS. For example:
`interpolation: { prefix: '@' }` will allow parsing of the interpolated value `@{batman}` which uses `@` as the "prefix". For SCSS one might use `interpolation: { prefix: '#' }`.

##### `variables`

Type: `Object`<br>
Default: `{ prefixes: ['--'] }`

Set this option to modify how variables are identified in a value. By default, this option is set to recognize CSS variables. For languages such as LESS and SCSS which have their own variable prefixes, additional prefixes can be added to the `prefixes` array.

### `stringify(node, builder)`

A `Function` with a signature matching `(bit) => {}` used to concatenate or manipulate each portion (or bit) of the Node's own AST. The `nodeToString` method makes use of this, as a simple example.

#### Parameters

#### `node`

Type: `Node`<br>
_Required_

The `Node` to stringify.

#### `builder`

Type: `Function`
_Required_

### `nodeToString(node)`

Transforms a `Node` into its `String` representation.

#### Parameters

#### `node`

Type: `Node`<br>
_Required_
