# Container Node

The `Container` node inherits directly from `Container` in PostCSS. This node serves as a base class for nodes that can contain other nodes as children. It provides functionality for managing child nodes and traversing the AST.

## Properties

### `nodes`

Type: `Array`<br>

An array of child nodes contained within this container. These can be any type of node including other containers.

### `type`

Type: `String`<br>

The type of the container node. This is set by the specific container implementation.

### `value`

Type: `String`<br>

A `String` representation of the container's value. This is typically set during construction and provides context about the container's content.

## Methods

### `add(node)`

Adds a child node to this container.

#### Parameters

#### `node`

Type: `Node|Container`<br>
_Required_

The node to add as a child of this container.

### `toString(stringifier)`

Converts the container and all its children to a string representation.

#### Parameters

#### `stringifier`

Type: `Stringifier`<br>
_Optional_

A custom stringifier function. If not provided, uses the default stringify function.

## Inherited Properties

This class inherits all properties and methods from PostCSS's `Container` class. Please see the [PostCSS Documentation](https://github.com/postcss/postcss/tree/master/docs) for additional methods and properties.

## Example Usage

```js
const { parse } = require('postcss-values-parser');

const root = parse('calc(100px + 20%)');
const func = root.nodes[0]; // This is a Func node, which extends Container

// Access child nodes
console.log(func.nodes); // Array of nodes representing the calc() parameters

// Add a new node
const word = new Word({ value: 'test' });
func.add(word);
```

## Walker Methods

Container nodes have access to all walker methods for traversing their child nodes and descendants. These methods allow you to find and iterate over specific node types within the container:

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
const { parse } = require('postcss-values-parser');

const root = parse('calc(100px + 20%) url("image.jpg")');
const func = root.nodes[0]; // calc function

// Walk through numeric nodes within the function
func.walkNumerics((node) => {
  console.log(`${node.value}${node.unit}`);
});

// Walk through all words in the entire tree
root.walkWords((node) => {
  console.log(`Word: ${node.value}`);
});
```

See the [Walker](./Walker.md) documentation for more details on walker methods.

## Notes

- Container nodes automatically handle source mapping and position tracking when nodes are added
- Child nodes maintain references to their parent container
- The Container class provides the foundation for complex nodes like `Func`, `Root`, and `Parentheses`
- Walker methods are registered automatically when the module is loaded
- Walker methods traverse all descendants, not just direct children
