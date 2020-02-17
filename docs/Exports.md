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

##### `context`
Type: [`postcss.Input`][]<br>
Default: `undefined`

[`postcss.Input`]: http://api.postcss.org/Input.html

Set this option along with [`lineInContext`][] and [`columnInContext`][] to indicate the value's location in a larger CSS file that's been parsed by PostCSS. When these options are set, the values' `source` properties will refer to their locations inside the original CSS file which produces better error messages.

[`lineInContext`]: #lineincontext
[`columnInContext`]: #columnincontext

If this is set, `lineInContext` and `columnInContext` must be set as well. The [`parseDeclValue()`][] and [`parseAtRuleParams()`][] functions automatically set these options appropriately.

[`parseDeclValue()`]: #parsedeclvaluedecl-options
[`parseAtRuleParams()`]: #parseatruleparamsrule-options

##### `lineInContext`
Type: `Number`<br>
Default: `undefined`

Indicates the line number in the [`context`][] on which the value being parsed begins.

[`context`]: #context

If this is set, `context` and [`columnInContext`][] must be set as well. The [`parseDeclValue()`][] and [`parseAtRuleParams()`][] functions automatically set these options appropriately.

##### `columnInContext`
Type: `Number`<br>
Default: `undefined`

Indicates the column number in the [`context`][] on which the value being parsed begins.

If this is set, `context` and [`lineInContext`][] must be set as well. The [`parseDeclValue()`][] and [`parseAtRuleParams()`][] functions automatically set these options appropriately.

### `parseDeclValue(decl, options)`

A shorthand for calling [`parse()`][] on the value of a [`postcss.Declaration`][] object. This automatically sets the [`context`][], [`lineInContext`][], and [`columnInContext`][] options appropriately.

[`postcss.Declaration`]: http://api.postcss.org/Declaration.html
[`parse()`]: #parsecss-options

#### Parameters

#### `decl`
Type: [`postcss.Declaration`][]<br>
_Required_

#### `options`
Type: `Object`

### `parseAtRuleParams(rule, options)`

A shorthand for calling [`parse()`][] on the parameters of a [`postcss.AtRule`][] object. This automatically sets the [`context`][], [`lineInContext`][], and [`columnInContext`][] options appropriately.

[`postcss.AtRule`]: http://api.postcss.org/AtRule.html

#### Parameters

#### `decl`
Type: [`postcss.AtRule`][]<br>
_Required_

#### `options`
Type: `Object`

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
