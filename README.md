[actions]: https://github.com/shellscape/postcss-values-parser/actions/workflows/validate.yml/badge.svg?branch=master
[actions-url]: https://github.com/shellscape/postcss-values-parser/actions/workflows/validate.yml
[size]: https://packagephobia.now.sh/badge?p=postcss-values-parser
[size-url]: https://packagephobia.now.sh/result?p=postcss-values-parser

<div align="center">
  <img width="95" height="95" title="Philosopher’s stone, logo of PostCSS" src="http://postcss.github.io/postcss/logo.svg"><br/><br/>
</div>

# postcss-values-parser [![actions][actions]][actions-url] [![size][size]][size-url]

A CSS property value parser that uses [css-tree](https://github.com/csstree/csstree) for parsing,
and models nodes on top of PostCSS’s `Node`/`Container`/`Root` classes so the API feels familiar to PostCSS users.

This package powers part of [Prettier](https://prettier.io/). Please consider becoming a sponsor if you find this package useful or are a Prettier user. https://github.com/sponsors/shellscape

## Install

Using npm:

```console
npm install postcss-values-parser --save-dev
```

## Requirements

- Node.js >= 20.19.0
- PostCSS >= 8.4.14 (peer dependency)

Note: This package is ESM‑only. Use `import` in Node.js or load from CommonJS via dynamic import:

```js
const mod = await import('postcss-values-parser');
```

## Benefits

- Uses css-tree for fast, standards‑compliant parsing
- Builds PostCSS‑style nodes for a familiar API
- Doesn't strip characters; e.g., parentheses are preserved in the AST
- Full [AST](https://en.wikipedia.org/wiki/Abstract_syntax_tree) traversal
- Optional walker helpers (`registerWalkers(Container)`) to walk by node type
- Convenience methods to stringify nodes
- Provides convenience properties for number units, colors, etc.

## Usage

Please see the [Documentation](./docs/README.md) for general use and further information on using the package.

## Meta

[CONTRIBUTING](./.github/CONTRIBUTING.md)

[LICENSE (Mozilla Public License)](./LICENSE)
