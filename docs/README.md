# Documentation

This is the extended documentation for `postcss-values-parser`.

## Parsing

Parsing is accomplished by leveraging the `parse` method. For example:

```js
import { parse } from 'postcss-values-parser';

const root = parse('#fff');
```

Please see the [Exports](./Exports.md) documentation for further information.

Parsing is powered by [css-tree](https://github.com/csstree/csstree). Nodes in this package extend PostCSS `Node`/`Container`/`Root` so the API feels familiar, but there is no PostCSS parser involved.

> Note: This package is ESM‑only. Use `import` syntax in Node.js. If you must use CommonJS, load it via dynamic import:
>
> ```js
> // CommonJS
> import('postcss-values-parser').then(({ parse }) => {
>   const root = parse('#fff');
> });
> // or
> (async () => {
>   const { parse } = await import('postcss-values-parser');
>   const root = parse('#fff');
> })();
> ```

## Nodes

This module provides several unique Node types, in addition to the built-in Nodes that ship with PostCSS:

[Comment](./Comment.md)<br/>
[Container](./Container.md)<br/>
[Func](./Func.md)<br/>
[Node](./Node.md)<br/>
[Numeric](./Numeric.md)<br/>
[Operator](./Operator.md)<br/>
[Parentheses](./Parentheses.md)<br/>
[Punctuation](./Punctuation.md)<br/>
[Quoted](./Quoted.md)<br/>
[Root](./Root.md)<br/>
[UnicodeRange](./UnicodeRange.md)<br/>
[Word](./Word.md)<br/>

All unique Node types listed above inherit from `Node` or `Container` in PostCSS. Please see each Node's documentation for the inherited type. Methods for the base types can be found in the [PostCSS Documentation](https://github.com/postcss/postcss/tree/master/docs).

Additionally, this module provides several other foundational classes:

[Errors](./Errors.md) - Custom error classes for parsing failures<br/>
[Examples](./Examples.md) - Comprehensive usage examples and patterns<br/>
[Parser](./Parser.md) - Parser implementation and configuration options<br/>
[Stringify](./Stringify.md) - String conversion and custom stringifiers<br/>
[Walker](./Walker.md) - Walker registration and functionality<br/>

## Walking The AST

PostCSS provides a means to walk the entire AST to examine nodes of a particular type, regardless of how they are nested in the tree. This package exposes a `registerWalkers(Container)` helper to add convenience walkers (e.g. `walkNumerics`) onto `Root`/`Container` instances.

Walker methods are not registered by default. Call `registerWalkers(Container)` once before using them. Each walker function has a signature of `walk{Node}s` (plural). For example, to walk all numeric values:

```js
import { Container, parse, registerWalkers } from 'postcss-values-parser';

// enable walker helpers
registerWalkers(Container);

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
//   value: '3',
//   type: 'numeric',
//   unit: 'pt',
//   ...
// } ]
```
