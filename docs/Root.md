# Root Node

The `Root` node inherits directly from `Root` in PostCSS. This node represents the root of the AST and serves as the top-level container for all parsed nodes in a CSS value.

## Properties

### `nodes`

Type: `Array`<br>

An array of child nodes contained within this root. These represent the top-level components of the parsed CSS value.

### `type`

Type: `String`<br>
Value: `'root'`

### `value`

Type: `String`<br>

A `String` representation of the root's value, typically an empty string as the root contains the parsed structure rather than a direct value.

## Methods

### `add(node)`

Adds a child node to this root container.

#### Parameters

#### `node`

Type: `Node`<br>
_Required_

The node to add as a child of this root.

### `toString(stringifier)`

Converts the root and all its children to a string representation.

#### Parameters

#### `stringifier`

Type: `Stringifier`<br>
_Optional_

A custom stringifier function. If not provided, uses the default stringify function.

## Inherited Properties

This class inherits all properties and methods from PostCSS's `Root` class. Please see the [PostCSS Documentation](https://github.com/postcss/postcss/tree/master/docs) for additional methods and properties.

## Example Usage

```js
const { parse } = require('postcss-values-parser');

const root = parse('10px solid red');

console.log(root.type); // 'root'
console.log(root.nodes.length); // 3 (numeric, word, word)

// Walk through all nodes
root.nodes.forEach((node, index) => {
  console.log(`Node ${index}: ${node.type} - ${node.value}`);
});

// Convert back to string
console.log(root.toString()); // '10px solid red'
```

## Walker Methods

The Root node has access to all walker methods for traversing the AST. These methods allow you to find and iterate over specific node types throughout the entire tree:

- `walkFuncs(callback)` - Walk through all function nodes
- `walkWords(callback)` - Walk through all word nodes
- `walkNumerics(callback)` - Walk through all numeric nodes
- `walkOperators(callback)` - Walk through all operator nodes
- `walkQuoteds(callback)` - Walk through all quoted string nodes
- `walkUnicodeRanges(callback)` - Walk through all unicode range nodes
- `walkComments(callback)` - Walk through all comment nodes
- `walkPunctuations(callback)` - Walk through all punctuation nodes
- `walkType(type, callback)` - Walk through all nodes of a specific type

```js
const root = parse('calc(100px + 20%) "test" #fff');

// Find all numeric values
root.walkNumerics((node) => {
  console.log(`${node.value}${node.unit}`);
});

// Find all functions
root.walkFuncs((node) => {
  console.log(`Function: ${node.name}`);
});

// Find nodes by type
root.walkType('word', (node) => {
  console.log(`Word: ${node.value}`);
});
```

See the [Walker](./Walker.md) documentation for more details on walker methods.

## Notes

- The Root node is always the top-level node returned by the `parse()` function
- It automatically handles source mapping and position tracking for all child nodes
- The Root node provides access to all walker methods for traversing the AST
- When stringified, the Root node reconstructs the original CSS value from its child nodes
- Walker methods are registered automatically when the module is loaded