# Exported API

This module exports the following methods and classes:

### `parse(css, options?)`

Returns: `Root`<br>

Parses a given string and returns an AST with a `Root` node. If the input is an invalid CSS value, a `ParseError` is thrown.

#### Parameters

#### `css`

Type: `String`<br>
_Required_

#### `options`

Type: `ParseOptions` (optional)

Reserved for future use. In v7, options are accepted by the signature but are not used by the parser.

### `stringify(node, builder)`

A function used to concatenate or manipulate each portion (or bit) of a node during stringification. The `nodeToString` helper uses this under the hood.

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

Registers custom walker methods on the Container prototype to enable walking specific node types. This function is not called automatically; call it once before using any `walk*` helpers.

#### Parameters

#### `Container`

Type: `Container`<br>
_Required_

The Container class to register walker methods on.

## Exported Classes

All node classes are exported and can be imported individually:

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

- `ParseOptions` - Placeholder in v7 (forward‑compatibility)
- `Stringifier` - Function interface for custom stringifiers
- `Builder` - Function interface for string building during stringify
- `NodeOptions` - Options interface for node construction

## Types

### `ParseOptions`

An empty placeholder interface in v7. Kept for forward‑compatibility.

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
import { parse, Node, Container, Root } from 'postcss-values-parser';

// Import error classes
import { ParseError, AstError } from 'postcss-values-parser';

// Import utility functions
import { stringify, nodeToString, registerWalkers } from 'postcss-values-parser';

// Parse
const root = parse('calc(100px + 20%)');

// Custom stringifier
const customStringifier = (node, builder) => {
  builder(node.value.toUpperCase());
};

console.log(root.toString(customStringifier));
```
