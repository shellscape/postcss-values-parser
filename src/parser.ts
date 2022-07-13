/*
  Copyright © 2018 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/
import { parse as parseAst, Value } from 'css-tree';
import { Input, Root as PostCssRoot } from 'postcss';

import { AstError, ParseError } from './errors';
import * as Nodes from './nodes';

class Root extends PostCssRoot {
  // Note: The PostCSS types for .push seem a bit jacked up.
  // it incorrectly expects properties for types on Declaration for anything being pushed
  add(node: Nodes.Node) {
    return this.push(node as any);
  }
}

export const parse = (css: string) => {
  let ast: Value;
  const root = new Root({
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

  for (const node of nodes) {
    switch (node.type) {
      case 'Dimension':
      case 'Number':
        root.add(new Nodes.Numeric({ node }));
        break;
      case 'Operator':
        root.add(new Nodes.Operator({ node }));
        break;
      default:
        root.add(new Nodes.Word({ node }));
        break;
    }
  }

  return root;
};
