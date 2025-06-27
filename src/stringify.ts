/*
  Copyright © 2025 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/

interface Builder {
  (part: string, node?: any, type?: 'start' | 'end'): void;
}

export interface Stringifier {
  (node: any, builder: Builder): void;
}

const stringifyNode = (node: any, builder: Builder, parentNode?: any, index?: number): void => {
  // Add space before non-operator nodes if needed
  const needsSpaceAfter = (prevNode: any, currentNode: any) => {
    if (!prevNode) return false;
    if (prevNode.type === 'operator' || currentNode.type === 'operator') return false;
    if (prevNode.type === 'punctuation' || currentNode.type === 'punctuation') return false;
    return true;
  };

  // Add space before current node if needed
  if (parentNode && parentNode.nodes && index !== undefined && index > 0) {
    const prevNode = parentNode.nodes[index - 1];
    if (needsSpaceAfter(prevNode, node)) {
      builder(' ');
    }
  }

  switch (node.type) {
    case 'root':
      if (node.nodes) {
        for (let i = 0; i < node.nodes.length; i++) {
          stringifyNode(node.nodes[i], builder, node, i);
        }
      }
      break;

    case 'func':
      builder(node.name, node, 'start');
      builder('(', node);
      if (node.nodes) {
        for (let i = 0; i < node.nodes.length; i++) {
          stringifyNode(node.nodes[i], builder, node, i);
        }
      }
      builder(')', node, 'end');
      break;

    case 'parentheses':
      builder('(', node, 'start');
      if (node.nodes) {
        for (let i = 0; i < node.nodes.length; i++) {
          stringifyNode(node.nodes[i], builder, node, i);
        }
      }
      builder(')', node, 'end');
      break;

    case 'word':
    case 'numeric':
    case 'operator':
    case 'quoted':
    case 'unicodeRange':
    case 'punctuation':
      builder(node.value || '', node);
      break;

    case 'comment':
      if (node.inline) {
        builder(`//${node.text}`, node);
      } else {
        builder(`/*${node.text}*/`, node);
      }
      break;

    default:
      if (node.value) {
        builder(node.value, node);
      }
      break;
  }
};

export const stringify: Stringifier = (node: any, builder: Builder) => {
  stringifyNode(node, builder);
};
