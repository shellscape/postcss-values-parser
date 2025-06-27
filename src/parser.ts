/*
  Copyright © 2018 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/
import { CssNode, CssNodePlain, List, parse as parseAst, Value } from 'css-tree';
import { Input } from 'postcss';

import { AstError, ParseError } from './errors';
import * as Nodes from './nodes';

export interface ParseOptions {
  ignoreUnknownWords?: boolean;
  interpolation?: boolean | InterpolationOptions;
}

const defaults: ParseOptions = {
  ignoreUnknownWords: false,
  interpolation: false
};

export interface InterpolationOptions {
  prefix: string;
}

interface MaybeParent {
  children: List<CssNode> | CssNodePlain[];
}

const assign = (parent: Nodes.Container, nodes: CssNode[]) => {
  for (const node of nodes) {
    let newNode: Nodes.Container | Nodes.Node;

    switch (node.type) {
      case 'Function':
        newNode = new Nodes.Func({ node });
        break;
      case 'Dimension':
      case 'Number':
        newNode = new Nodes.Numeric({ node });
        break;
      case 'Operator':
        newNode = new Nodes.Operator({ node });
        break;
      case 'Parentheses':
        newNode = new Nodes.Parens({ node });
        break;
      case 'UnicodeRange':
        newNode = new Nodes.UnicodeRange({ node });
        break;
      default:
        newNode = new Nodes.Word({ node });
        break;
    }

    const maybeParent = node as unknown as MaybeParent;

    if (maybeParent.children) {
      let children: CssNode[];
      if (maybeParent.children instanceof List) children = maybeParent.children.toArray();
      else ({ children } = maybeParent as any);

      assign(newNode as Nodes.Container, children);
    }

    parent.add(newNode);
  }
};

export const parse = (css: string, opts?: ParseOptions) => {
  // @ts-ignore
  // eslint-disable-next-line
  const options = Object.assign({}, defaults, opts);
  let ast: Value;
  const root = new Nodes.Root({
    source: {
      input: new Input(css),
      start: { column: 1, line: 1, offset: 0 }
    }
  });

  try {
    ast = parseAst(css, {
      context: 'value',
      positions: true
    }) as Value;
  } catch (error: any) {
    throw new ParseError(error);
  }

  if (!ast?.children) throw new AstError();

  const nodes = ast.children.toArray();

  if (!nodes.length) throw new AstError();

  assign(root, nodes);

  return root;
};
