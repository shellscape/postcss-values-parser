# Documentation

This is the extended documentation for `postcss-values-parser`.

## Parsing

Parsing is accomplished by leveraging the `parse` method. For example:

```js
const { parse } = require('postcss-values-parser');
const root = parse('#fff');
```

Please see the [Exports](./Exports.md) documentation for further information.

The parser used in this module is derived and inherits from the PostCSS `Parser` class. Methods for the base parser can be found in the [PostCSS Documentation](https://github.com/postcss/postcss/tree/master/docs).

## Nodes

This module provides several unique Node types, in addition to the built-in Nodes that ship with PostCSS:

[AtWord](./AtWord.md)<br/>
[Comment](./Comment.md)<br/>
[Func](./Comment.md)<br/>
[Interpolation](./Comment.md)<br/>
[Numeric](./Comment.md)<br/>
[Operator](./Comment.md)<br/>
[Punctuation](./Comment.md)<br/>
[Quoted](./Comment.md)<br/>
[UnicodeRange](./Comment.md)<br/>
[Word](./Comment.md)<br/>

All unique Node types listed above inherit from `Node` or `Container` in PostCSS. Please see each Node's documentation for the inherited type. Methods for the base types can be found in the [PostCSS Documentation](https://github.com/postcss/postcss/tree/master/docs).

## Walking The AST

PostCSS provides a means to walk the entire AST to examine nodes of a particular type, regardless of how they are nested in the tree. Each Node type listed above registers a custom walker function with PostCSS to allow walking on those types.

Each walker function has a signature of `walk{Node}s`. If wishing to walk all of the numeric values in a value, one would accomplish that like so:

```js
const { parse } = require('postcss-values-parser');

const root = parse('10px 1em 2rem 3pt');
let nodes = [];

root.walkNumerics((node) => nodes.push(node));

// → [ Numeric {
//   value: '10',
//   type: 'numeric',
//   unit: 'px',
//   ...
// },
// Numeric {
//   value: '1',
//   type: 'numeric',
//   unit: 'em',
//   ...
//   },
// Numeric {
//   value: '2',
//   type: 'numeric',
//   unit: 'rem',
//   ...
// },
// Numeric {
//   value: '3s',
//   type: 'numeric',
//   unit: 'pt',
//   ...
// } ]

```
