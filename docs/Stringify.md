# Stringify

The stringify functionality provides methods to convert AST nodes back into their string representations. This module exports the core `stringify` function and the utility `nodeToString` function.

## stringify(node, builder)

The main stringify function that converts a node and its children into their string representation by calling a builder function with string parts.

### Parameters

#### `node`

Type: `Node`<br>
_Required_

The AST node to stringify. This can be any node type including `Root`, `Container`, `Word`, `Numeric`, `Func`, etc.

#### `builder`

Type: `Builder`<br>
_Required_

A function that receives string parts and builds the final string representation. The builder function has the signature:

```typescript
interface Builder {
  (part: string, node?: any, type?: 'start' | 'end'): void;
}
```

### Implementation Details

The stringify function handles different node types appropriately:

- **Word nodes**: Outputs the word value directly
- **Numeric nodes**: Outputs the numeric value with unit
- **Quoted nodes**: Outputs the quoted string with quotes
- **Function nodes**: Outputs function name with parentheses and parameters
- **Container nodes**: Recursively stringifies all child nodes
- **Operator nodes**: Outputs the operator character
- **Punctuation nodes**: Outputs the punctuation character
- **Comment nodes**: Outputs the comment with appropriate markers
- **Unicode Range nodes**: Outputs the unicode range value
- **Parentheses nodes**: Outputs content wrapped in parentheses

### Example Usage

```js
const { parse, stringify } = require('postcss-values-parser');

const root = parse('calc(100px + 20%)');
let result = '';

// Custom builder that concatenates parts
const builder = (part) => {
  result += part;
};

stringify(root, builder);
console.log(result); // 'calc(100px + 20%)'
```

## nodeToString(node)

A utility function that converts a single node to its string representation using the default stringify function.

### Parameters

#### `node`

Type: `Node`<br>
_Required_

The node to convert to a string.

### Returns

Type: `String`<br>

The string representation of the node.

### Example Usage

```js
const { parse, nodeToString } = require('postcss-values-parser');

const root = parse('10px solid red');
const numericNode = root.nodes[0];

console.log(nodeToString(numericNode)); // '10px'
```

## Custom Stringifiers

You can create custom stringifier functions to modify how nodes are converted to strings. A stringifier function receives a node and a builder function:

```typescript
interface Stringifier {
  (node: any, builder: Builder): void;
}
```

### Example Custom Stringifier

```js
const { parse } = require('postcss-values-parser');

// Custom stringifier that uppercases all word values
const upperCaseStringifier = (node, builder) => {
  if (node.type === 'word') {
    builder(node.value.toUpperCase());
  } else if (node.type === 'numeric') {
    builder(node.value + node.unit);
  } else if (node.nodes) {
    // Handle container nodes
    node.nodes.forEach(child => {
      upperCaseStringifier(child, builder);
    });
  } else {
    // Default behavior for other node types
    builder(node.value || '');
  }
};

const root = parse('10px solid red');
console.log(root.toString(upperCaseStringifier)); // '10pxSOLIDRED'
```

## Node toString() Method

All nodes have a `toString()` method that accepts an optional stringifier parameter:

```js
const { parse } = require('postcss-values-parser');

const root = parse('calc(100px + 20%)');

// Default stringification
console.log(root.toString()); // 'calc(100px + 20%)'

// Custom stringification
console.log(root.toString(customStringifier));
```

## Advanced Usage

### Preserving Formatting

The stringify function can preserve original formatting and spacing when nodes maintain source mapping information:

```js
const { parse } = require('postcss-values-parser');

const root = parse('calc( 100px + 20% )'); // Note the extra spaces
console.log(root.toString()); // Preserves original spacing
```

### Handling Source Maps

When nodes have source mapping information, the stringify function can utilize this information to maintain accurate positioning:

```js
const { parse } = require('postcss-values-parser');

const root = parse('calc(100px + 20%)', { positions: true });
// Source mapping information is preserved during stringification
```

### Building Complex Strings

The builder function can be used to create complex string manipulations:

```js
const { parse, stringify } = require('postcss-values-parser');

const root = parse('10px solid red');
const parts = [];

// Builder that collects parts
const collectingBuilder = (part, node, type) => {
  parts.push({ part, nodeType: node?.type, type });
};

stringify(root, collectingBuilder);
console.log(parts); // Array of string parts with metadata
```

## Notes

- The stringify function is the core engine for converting AST nodes back to CSS text
- Custom stringifiers allow for advanced transformations during the stringify process
- The builder pattern allows for flexible string construction and manipulation
- Source mapping information is preserved and utilized when available
- The stringify function handles all node types defined in the parser
- Node order and structure are preserved during stringification