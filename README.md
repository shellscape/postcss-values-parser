[tests]: https://img.shields.io/circleci/project/github/shellscape/postcss-values-parser.svg
[tests-url]: https://circleci.com/gh/shellscape/postcss-values-parser
[cover]: https://codecov.io/gh/shellscape/postcss-values-parser/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/shellscape/postcss-values-parser
[size]: https://packagephobia.now.sh/badge?p=postcss-values-parser
[size-url]: https://packagephobia.now.sh/result?p=postcss-values-parser

<div align="center">
  <img width="95" height="95" title="Philosopher’s stone, logo of PostCSS" src="http://postcss.github.io/postcss/logo.svg"><br/><br/>
</div>

# postcss-values-parser [![tests][tests]][tests-url] [![cover][cover]][cover-url] [![size][size]][size-url]

A CSS property value parser built upon [PostCSS](https://github.com/postcss/postcss),
following the same node and traversal patterns as PostCSS.

This package powers part of [Prettier](https://prettier.io/). Please consider becoming a sponsor if you find this package useful or are a Prettier user. https://github.com/sponsors/shellscape

## Install

Using npm:

```console
npm install postcss-values-parser --save-dev
```

## Requirements

`postcss-values-parser` Node version v6.14.0+ and PostCSS v7.0.0+.

## Benefits

- Leverages PostCSS and its tokenizer under the hood
- Doesn't strip characters; eg. parenthesis
- Full [AST](https://en.wikipedia.org/wiki/Abstract_syntax_tree) traversal
- Ability to walk the AST for every Node type
- Convenience methods to stringify Nodes
- Follows PostCSS patterns for whitespace between Nodes
- Provides convenience properties for number units, colors, etc.

## Usage

Please see the [Documentation](./docs/README.md) for general use and further information on using the package.

## Meta

[CONTRIBUTING](./.github/CONTRIBUTING.md)

[LICENSE (Mozilla Public License)](./LICENSE)
