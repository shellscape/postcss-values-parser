# Exported Methods

This module exports the following methods and classes:

### `parse(css, options)`

Returns: `Root`<br>

Parses a given `String` and returns an AST with a `Root` node. If the input is an invalid CSS value, a `ParseError` is thrown.

#### Parameters

#### `css`

Type: `String`<br>
_Required_

#### `options`

Type: `ParseOptions`<br>
_Optional_

##### Properties

##### `ignoreUnknownWords`

Type: `Boolean`<br>
Default: `false`

If `true`, will allow all unknown parts of the value to be parsed and added to the AST. If `false`, unknown values will throw `ParseError`.

##### `interpolation`

Type: `Boolean|InterpolationOptions`<br>
Default: `false`

Set this option to enable parsing of interpolated values for languages such as SCSS. For example:
`interpolation: { prefix: '@' }` will allow parsing of the interpolated value `@{batman}` which uses `@` as the "prefix". For SCSS one might use `interpolation: { prefix: '#' }`.

##### `variables`

Type: `VariablesOptions`<br>
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

Type: `Builder`<br>
_Required_

A function that receives string parts and builds the final string representation.

### `nodeToString(node)`

Transforms a `Node` into its `String` representation using the default stringify function.

#### Parameters

#### `node`

Type: `Node`<br>
_Required_

Returns: `String`

### `registerWalkers(Container)`

Registers custom walker methods on the Container prototype to enable walking specific node types. This function is called automatically when the module is loaded, but can be called manually if needed.

#### Parameters

#### `Container`

Type: `Container`<br>
_Required_

The Container class to register walker methods on.

## Exported Classes

All Node classes are exported and can be imported individually:

### Node Classes

- `Node` - Base class for all nodes
- `Container` - Base class for nodes that can contain other nodes
- `Root` - Root node of the AST
- `Comment` - Comment nodes
- `Func` - Function nodes
- `Numeric` - Numeric value nodes
- `Operator` - Operator nodes
- `Parentheses` - Parentheses grouping nodes
- `Punctuation` - Punctuation nodes
- `Quoted` - Quoted string nodes
- `UnicodeRange` - Unicode range nodes
- `Word` - Word/identifier nodes

### Error Classes

- `ParseError` - Thrown when parsing fails due to invalid CSS syntax
- `AstError` - Thrown when AST is invalid or empty after parsing

### Type Definitions

- `ParseOptions` - Options interface for the parse function
- `InterpolationOptions` - Options for interpolation parsing
- `VariablesOptions` - Options for variable recognition
- `Stringifier` - Function interface for custom stringifiers
- `Builder` - Function interface for string building during stringify
- `NodeOptions` - Options interface for node construction

## Type Interfaces

### `ParseOptions`

```typescript
interface ParseOptions {
  ignoreUnknownWords?: boolean;
  interpolation?: boolean | InterpolationOptions;
  variables?: VariablesOptions;
}
```

### `InterpolationOptions`

```typescript
interface InterpolationOptions {
  prefix: string;
}
```

### `VariablesOptions`

```typescript
interface VariablesOptions {
  prefixes: string[];
}
```

### `Stringifier`

```typescript
interface Stringifier {
  (node: any, builder: Builder): void;
}
```

### `Builder`

```typescript
interface Builder {
  (part: string, node?: any, type?: 'start' | 'end'): void;
}
```

### `NodeOptions`

```typescript
interface NodeOptions {
  node?: CssNode;
  value?: string;
  parent?: any;
}
```

## Usage Examples

```js
// Import specific classes
const { parse, Node, Container, Root } = require('postcss-values-parser');

// Import error classes
const { ParseError, AstError } = require('postcss-values-parser');

// Import utility functions
const { stringify, nodeToString, registerWalkers } = require('postcss-values-parser');

// Parse with options
const root = parse('calc(100px + 20%)', {
  ignoreUnknownWords: true,
  variables: { prefixes: ['--', '$'] }
});

// Custom stringifier
const customStringifier = (node, builder) => {
  builder(node.value.toUpperCase());
};

console.log(root.toString(customStringifier));
```
