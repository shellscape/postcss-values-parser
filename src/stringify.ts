import { AnyNode, Builder } from 'postcss';

export class ValuesStringifier {
  builder: (str: string, node?: any, type?: 'start' | 'end') => void;

  constructor(builder: Builder) {
    this.builder = builder;
  }

  raw(node: any, own: string, detect?: string): string {
    let value = '';
    if (own) {
      value = node.raws[own];
      if (typeof value !== 'undefined') return value;
    }
    if (detect && node.raws[detect]) {
      value = node.raws[detect];
    }
    return value;
  }

  stringify(node: any): void {
    const method = (this as any)[node.type];
    if (method && typeof method === 'function') {
      method.call(this, node);
    }
  }
  basic(node: AnyNode, value: string | null = null) {
    const print = value || (node as any).value;
    const after = node.raws.after ? this.raw(node, 'after') || '' : '';
    // NOTE: before is handled by postcss in stringifier.body

    this.builder(print, node, 'start');
    this.builder(after, node, 'end');
  }

  atword(...args: any) {
    // @ts-ignore
    this.atrule(...args);
  }

  comment(node: any) {
    if (node.inline) {
      const left = this.raw(node, 'left', 'commentLeft');
      const right = this.raw(node, 'right', 'commentRight');
      this.builder(`//${left}${node.text}${right}`, node);
    } else {
      // Handle regular comments
      const left = this.raw(node, 'left', 'commentLeft');
      const right = this.raw(node, 'right', 'commentRight');
      this.builder(`/*${left}${node.text}${right}*/`, node);
    }
  }

  func(node: any) {
    const after = this.raw(node, 'after') || '';

    this.builder(`${node.name}(`, node, 'start');

    for (const child of node.nodes) {
      // since we're duplicating this.body here, we have to handle `before`
      // but we don't want the postcss default \n value, so check it's non-empty first
      const before = child.raws.before ? this.raw(child, 'before') : '';
      if (before) {
        this.builder(before);
      }
      this.stringify(child);
    }

    this.builder(`)${after}`, node, 'end');
  }

  interpolation(node: any) {
    this.basic(node, node.prefix + node.params);
  }

  numeric(node: any) {
    const print = node.value + node.unit;
    this.basic(node, print);
  }

  operator(node: any) {
    this.basic(node);
  }

  // FIXME: we need to render parens correctly
  parens(node: any) {
    this.basic(node);
  }

  punctuation(node: any) {
    this.basic(node);
  }

  quoted(node: any) {
    this.basic(node);
  }

  unicodeRange(node: any) {
    this.basic(node);
  }

  word(node: any) {
    this.basic(node);
  }
}

export const stringify = (node: any, builder: Builder) => {
  const stringifier = new ValuesStringifier(builder);
  stringifier.stringify(node);
};
