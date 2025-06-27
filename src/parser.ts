/*
  Copyright © 2025 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/
import { CssNode, CssNodePlain, List, parse as parseAst, Value } from 'css-tree';

import { AstError, ParseError } from './errors.js';
import * as Nodes from './nodes/index.js';

export interface ParseOptions {
  ignoreUnknownWords?: boolean;
  interpolation?: boolean | InterpolationOptions;
  variables?: VariablesOptions;
}

export interface InterpolationOptions {
  prefix: string;
}

export interface VariablesOptions {
  prefixes: string[];
}

interface MaybeParent {
  children: List<CssNode> | CssNodePlain[];
}

const assign = (parent: Nodes.Container | Nodes.Root, nodes: CssNode[]) => {
  for (const node of nodes) {
    let newNode:
      | Nodes.Container
      | Nodes.Node
      | Nodes.Numeric
      | Nodes.Operator
      | Nodes.UnicodeRange
      | Nodes.Word
      | Nodes.Func
      | Nodes.Quoted
      | Nodes.Comment
      | Nodes.Punctuation
      | Nodes.Parentheses;

    switch (node.type) {
      case 'Function':
        newNode = new Nodes.Func({ node });
        break;
      case 'Url':
        // Create a Word node for URL with the URL value for toString()
        newNode = new Nodes.Word({
          node: {
            ...node,
            type: 'Identifier' as any,
            name: (node as any).value || ''
          } as any
        });
        // Set the value property to the URL content for toString()
        (newNode as any).value = (node as any).value || '';
        break;
      case 'Dimension':
      case 'Number':
      case 'Percentage':
        newNode = new Nodes.Numeric({ node });
        break;
      case 'Operator':
        newNode = new Nodes.Operator({ node });
        break;
      case 'UnicodeRange':
        newNode = new Nodes.UnicodeRange({ node });
        break;
      case 'String':
        newNode = new Nodes.Quoted({ node });
        break;
      case 'Hash':
      case 'Identifier':
        newNode = new Nodes.Word({ node });
        break;
      case 'Parentheses':
        newNode = new Nodes.Parentheses({ node });
        break;
      default:
        // Fallback to Word for unknown types
        newNode = new Nodes.Word({ node });
        break;
    }

    const maybeParent = node as unknown as MaybeParent;

    if (
      maybeParent.children &&
      (newNode instanceof Nodes.Container ||
        newNode instanceof Nodes.Func ||
        newNode instanceof Nodes.Parentheses)
    ) {
      let children: CssNode[];
      if (maybeParent.children instanceof List) {
        children = maybeParent.children.toArray();
      } else {
        children = maybeParent.children as CssNode[];
      }

      assign(newNode as Nodes.Container, children);
    }

    parent.add(newNode);
  }
};

export const parse = (css: string, _opts?: ParseOptions) => {
  let ast: Value;
  const root = new Nodes.Root({
    node: {
      type: 'Value',
      loc: {
        source: css,
        start: { line: 1, column: 1 },
        end: { line: 1, column: css.length + 1 }
      }
    } as any
  });

  try {
    ast = parseAst(css, {
      context: 'value',
      positions: true
    }) as Value;
  } catch (error: any) {
    throw new ParseError(error);
  }

  if (!ast?.children) {
    throw new AstError();
  }

  const nodes = ast.children.toArray();

  if (!nodes.length) {
    throw new AstError();
  }

  // Store original CSS input for source extraction
  const assignWithSource = (
    parent: Nodes.Container | Nodes.Root,
    nodes: CssNode[],
    originalCss: string
  ) => {
    for (const node of nodes) {
      let newNode:
        | Nodes.Container
        | Nodes.Node
        | Nodes.Numeric
        | Nodes.Operator
        | Nodes.UnicodeRange
        | Nodes.Word
        | Nodes.Func
        | Nodes.Quoted
        | Nodes.Comment
        | Nodes.Punctuation
        | Nodes.Parentheses;

      // Create node options with original CSS for source extraction
      const nodeOptions = {
        node: {
          ...node,
          loc: node.loc
            ? {
                ...node.loc,
                source: originalCss
              }
            : undefined
        }
      };

      switch (node.type) {
        case 'Function':
          newNode = new Nodes.Func(nodeOptions);
          break;
        case 'Url':
          // Create a Word node for URL with the URL value for toString()
          newNode = new Nodes.Word({
            node: {
              ...nodeOptions.node,
              type: 'Identifier' as any,
              name: (node as any).value || ''
            } as any
          });
          // Set the value property to the URL content for toString()
          (newNode as any).value = (node as any).value || '';
          break;
        case 'Dimension':
        case 'Number':
        case 'Percentage':
          newNode = new Nodes.Numeric(nodeOptions);
          break;
        case 'Operator':
          newNode = new Nodes.Operator(nodeOptions);
          break;
        case 'UnicodeRange':
          newNode = new Nodes.UnicodeRange(nodeOptions);
          break;
        case 'String':
          newNode = new Nodes.Quoted(nodeOptions);
          break;
        case 'Hash':
        case 'Identifier':
          newNode = new Nodes.Word(nodeOptions);
          break;
        case 'Parentheses':
          newNode = new Nodes.Parentheses(nodeOptions);
          break;
        default:
          // Fallback to Word for unknown types
          newNode = new Nodes.Word(nodeOptions);
          break;
      }

      const maybeParent = node as unknown as MaybeParent;

      if (
        maybeParent.children &&
        (newNode instanceof Nodes.Container ||
          newNode instanceof Nodes.Func ||
          newNode instanceof Nodes.Parentheses)
      ) {
        let children: CssNode[];
        if (maybeParent.children instanceof List) {
          children = maybeParent.children.toArray();
        } else {
          children = maybeParent.children as CssNode[];
        }

        assignWithSource(newNode as Nodes.Container, children, originalCss);
      }

      parent.add(newNode);
    }
  };

  assignWithSource(root, nodes, css);

  return root;
};
