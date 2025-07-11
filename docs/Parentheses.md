# Parentheses Node

The `Parentheses` node inherits from `Container` in PostCSS. This node represents a parentheses grouping within a value. If the parentheses contain content, that content will be represented as parsed child nodes.

## Properties

### `nodes`

Type: `Array`<br>

An array of child nodes contained within the parentheses. These represent the parsed content between the parentheses.

### `type`

Type: `String`<br>
Value: `'parentheses'`

### `value`

Type: `String`<br>

A `String` representation of the parentheses, typically `'()'`. This provides the structural representation of the parentheses grouping.

## Methods

### `add(node)`

Adds a child node to this parentheses container.

#### Parameters

#### `node`

Type: `Node|Container`<br>
_Required_

The node to add as a child within the parentheses.

### `toString(stringifier)`

Converts the parentheses and all its children to a string representation.

#### Parameters

#### `stringifier`

Type: `Stringifier`<br>
_Optional_

A custom stringifier function. If not provided, uses the default stringify function.

## Inherited Properties

This class inherits all properties and methods from the `Container` class and PostCSS's `Container` class. Please see the [Container](./Container.md) documentation and [PostCSS Documentation](https://github.com/postcss/postcss/tree/master/docs) for additional methods and properties.

## Example Values

```css
(10px + 20px)
(red blue green)
(calc(100% - 20px))
```

## Example Usage

```js
const { parse } = require('postcss-values-parser');

const root = parse('calc((100px + 20px) * 2)');
const func = root.nodes[0]; // calc function
const parentheses = func.nodes[0]; // parentheses grouping

console.log(parentheses.type); // 'parentheses'
console.log(parentheses.value); // '()'
console.log(parentheses.nodes.length); // Number of nodes within parentheses

// Walk through parentheses content
parentheses.nodes.forEach(node => {
  console.log(`${node.type}: ${node.value}`);
});
```

## Notes

- Parentheses nodes are automatically created when the parser encounters parentheses groupings in CSS values
- The content within parentheses is parsed as separate child nodes
- Parentheses nodes maintain the structural integrity of grouped expressions
- They are commonly found within function arguments and mathematical expressions