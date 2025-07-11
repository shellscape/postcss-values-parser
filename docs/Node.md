# Node

The `Node` class is the base class for all AST nodes in postcss-values-parser. It inherits from PostCSS's `Node` class and provides the foundation for all specific node types.

## Properties

### `type`

Type: `String`<br>

The type of the node. This is set by each specific node implementation (e.g., 'word', 'numeric', 'func', etc.) and is used to identify the node type when traversing the AST. The base `Node` class does not set a type by default - this must be set by the extending class.

### `value`

Type: `String`<br>

A `String` representation of the node's value. This contains the actual content or text that the node represents.

### `source`

Type: `Object`<br>

Source position information for the node, including line and column numbers. This is automatically set when nodes are created during parsing and enables source mapping.

### `parent`

Type: `Container|Root`<br>

Reference to the parent node that contains this node. This is automatically set when nodes are added to containers.

## Methods

### `toString(stringifier)`

Converts the node to its string representation.

#### Parameters

#### `stringifier`

Type: `Stringifier`<br>
_Optional_

A custom stringifier function. If not provided, uses the default stringify function.

## Inherited Properties and Methods

This class inherits all properties and methods from PostCSS's `Node` class. Please see the [PostCSS Documentation](https://github.com/postcss/postcss/tree/master/docs) for additional methods and properties, including:

- `remove()` - Removes the node from its parent
- `replaceWith(node)` - Replaces this node with another node
- `clone()` - Creates a copy of the node
- `cloneBefore()` - Clones the node and inserts it before the current node
- `cloneAfter()` - Clones the node and inserts it after the current node

## Example Usage

```js
const { parse, Word } = require('postcss-values-parser');

const root = parse('bold italic');
const firstNode = root.nodes[0];

console.log(firstNode.type); // 'word'
console.log(firstNode.value); // 'bold'
console.log(firstNode.parent === root); // true

// Create a new node
const newNode = new Word({ value: 'underline' });
console.log(newNode.type); // 'word'
console.log(newNode.value); // 'underline'
```

## Notes

- The Node class is not typically instantiated directly; instead, use specific node classes like `Word`, `Numeric`, `Func`, etc.
- The base Node class does not set a `type` property - this must be set by extending classes in their constructors
- All nodes automatically maintain parent-child relationships when added to containers
- Source mapping information is preserved throughout parsing and manipulation
- The Node class provides the foundation for all AST traversal and manipulation operations
- The `value` property is readonly and should be set during construction via the options parameter