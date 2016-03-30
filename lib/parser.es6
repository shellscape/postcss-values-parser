import Root from './root';
import Value from './value';

import AtWord from './atword';
import Colon from './colon';
import Comma from './comma';
import Comment from './comment';
import Func from './function';
import Numbr from './number';
import Operator from './operator';
import Paren from './paren';
import Str from './string';
import Word from './word';

import tokenize from './tokenize';

import flatten from 'flatten';
import indexesOf from 'indexes-of';
import uniq from 'uniq';

function sortAscending (list) {
  return list.sort((a, b) => a - b);
}

export default class Parser {
  constructor (input) {
    this.input = input;
    this.position = 0;
    // we'll use this to keep track of the paren balance
    this.unbalanced = 0;
    this.root = new Root();

    let value = new Value();
    this.root.append(value);

    this.current = value;
    this.tokens = tokenize(input);
  }

  parse () {
    return this.loop();
  }

  colon () {
    let token = this.currToken;

    this.newNode(new Colon({
      value: token[1],
      source: {
        start: {
          line: token[2],
          column: token[3]
        },
        end: {
          line: token[4],
          column: token[5]
        }
      },
      sourceIndex: token[6]
    }));

    this.position ++;
  }

  comma () {
    let token = this.currToken;

    this.newNode(new Comma({
      value: token[1],
      source: {
        start: {
          line: token[2],
          column: token[3]
        },
        end: {
          line: token[4],
          column: token[5]
        }
      },
      sourceIndex: token[6]
    }));

    this.position ++;
  }

  comment () {
    let node = new Comment({
      value: this.currToken[1].replace(/\/\*|\*\//g, ''),
      source: {
        start: {
          line: this.currToken[2],
          column: this.currToken[3]
        },
        end: {
          line: this.currToken[4],
          column: this.currToken[5]
        }
      },
      sourceIndex: this.currToken[6]
    });

    this.newNode(node);
    this.position++;
  }

  error (message) {
    throw new Error(message); // eslint-disable-line new-cap
  }

  loop () {
    while (this.position < this.tokens.length) {
      this.parseTokens();
    }

    if (!this.current.last && this.spaces) {
      this.current.raws.before += this.spaces;
    }
    else if (this.spaces) {
      this.current.last.raws.after += this.spaces;
    }

    this.spaces = '';

    return this.root;
  }

  operator () {

    let node = new Operator({
      value: this.currToken[1],
      source: {
        start: {
          line: this.currToken[2],
          column: this.currToken[3]
        },
        end: {
          line: this.currToken[2],
          column: this.currToken[3]
        }
      },
      sourceIndex: this.currToken[4]
    });

    this.position ++;

    return this.newNode(node);
  }

  parseTokens () {
    switch (this.currToken[0]) {
      case 'space':
        this.space();
        break;
      case 'colon':
        this.colon();
        break;
      case 'comma':
        this.comma();
        break;
      case 'comment':
        this.comment();
        break;
      case '(':
        this.parenOpen();
        break;
      case ')':
        this.parenClose();
        break;
      case 'atword':
      case 'word':
        this.word();
        break;
      case 'operator':
        this.operator();
        break;
      case 'string':
        this.string();
        break;
      default:
        this.word();
        break;
    }
  }

  parenOpen () {
    let unbalanced = 1;
    let pos = this.position + 1;
    let token = this.currToken;

    // check for balanced parens
    while (pos < this.tokens.length && unbalanced) {
      let tkn = this.tokens[pos];

      if (tkn[0] === '(') {
        unbalanced++;
      }
      if (tkn[0] === ')') {
        unbalanced--;
      }
      pos ++;
    }

    if (unbalanced) {
      this.error('Expected closing parenthesis.');
    }

    // ok, all parens are balanced. continue on
    let last = this.current.last;

    if (last && last.type === 'func' && last.unbalanced < 0) {
      last.unbalanced = 0; // ok we're ready to add parens now
      this.cache = this.current;
      this.current = last;
    }

    this.current.unbalanced ++;

    this.newNode(new Paren({
      value: token[1],
      source: {
        start: {
          line: token[2],
          column: token[3]
        },
        end: {
          line: token[4],
          column: token[5]
        }
      },
      sourceIndex: token[6]
    }));

    this.position ++;

    // url functions get special treatment, and anything between the function
    // parens get treated as one word, if the contents aren't not a string.
    if (this.current.type === 'func' && this.current.unbalanced &&
        this.current.value === 'url' && this.currToken[0] !== 'string') {
      let nextToken = this.nextToken;
      let value = this.currToken[1];
      let start = {
        line: this.currToken[2],
        column: this.currToken[3]
      };

      while (nextToken && nextToken[0] !== ')' && this.current.unbalanced) {
        this.position ++;
        value += this.currToken[1];
        nextToken = this.nextToken;
      }

      if (this.position !== this.tokens.length - 1) {
        // skip the following word definition, or it'll be a duplicate
        this.position ++;

        this.newNode(new Word({
          value,
          source: {
            start,
            end: {
              line: this.currToken[4],
              column: this.currToken[5]
            }
          },
          sourceIndex: this.currToken[6]
        }));
      }
    }
  }

  parenClose () {
    let token = this.currToken;

    this.newNode(new Paren({
      value: token[1],
      source: {
        start: {
          line: token[2],
          column: token[3]
        },
        end: {
          line: token[4],
          column: token[5]
        }
      },
      sourceIndex: token[6]
    }));

    this.position ++;
    this.current.unbalanced --;

    if (this.current.unbalanced < 0) {
      this.error('Expected opening parenthesis.');
    }

    if (!this.current.unbalanced && this.cache) {
      this.current = this.cache;
      this.cache = null;
    }
  }

  space () {
    let token = this.currToken;
    // Handle space before and after the selector
    if (this.position === (this.tokens.length - 1) || this.nextToken[0] === ',' || this.nextToken[0] === ')') {
      this.current.last.raws.after += token[1];
      this.position ++;
    }
    else {
      this.spaces = token[1];
      this.position ++;
    }
  }

  splitWord () {
    let nextToken = this.nextToken;
    let word = this.currToken[1];

    while (nextToken && nextToken[0] === 'word') {
      this.position ++;

      let current = this.currToken[1];
      word += current;

      nextToken = this.nextToken;
    }

    let hasAt = indexesOf(word, '@');
    let indices = sortAscending(uniq(flatten([[0], hasAt])));
    let rNumber = /^((\d+(\.\d*)?)|(\.\d+))/;

    indices.forEach((ind, i) => {
      let index = indices[i + 1] || word.length;
      let value = word.slice(ind, index);
      let node;

      if (~hasAt.indexOf(ind)) {
        node = new AtWord({
          value: value.slice(1),
          source: {
            start: {
              line: this.currToken[2],
              column: this.currToken[3] + ind
            },
            end: {
              line: this.currToken[4],
              column: this.currToken[3] + (index - 1)
            }
          },
          sourceIndex: this.currToken[6] + indices[i]
        });
      }
      else if (rNumber.test(this.currToken[1])) {
        let unit = value.replace(rNumber, '');

        node = new Numbr({
          value: value.replace(unit, ''),
          source: {
            start: {
              line: this.currToken[2],
              column: this.currToken[3] + ind
            },
            end: {
              line: this.currToken[4],
              column: this.currToken[3] + (index - 1)
            }
          },
          sourceIndex: this.currToken[6] + indices[i],
          unit
        });
      }
      else {
        node = new (nextToken && nextToken[0] === '(' ? Func : Word)({
          value,
          source: {
            start: {
              line: this.currToken[2],
              column: this.currToken[3] + ind
            },
            end: {
              line: this.currToken[4],
              column: this.currToken[3] + (index - 1)
            }
          },
          sourceIndex: this.currToken[6] + indices[i]
        });

        if (node.constructor.name === 'Word') {
          node.isHex = /^#/.test(value);
          node.isColor = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(value);
        }
      }

      this.newNode(node);

    });

    this.position ++;
  }

  string () {
    let token = this.currToken;
    let value = this.currToken[1];
    let rQuote = /^(\"|\')/;
    let quoted = rQuote.test(value);
    let quote = '';
    let node;

    if (quoted) {
      quote = value.match(rQuote)[0];
      // set value to the string within the quotes
      // quotes are stored in raws
      value = value.slice(1, value.length - 1);
    }

    node = new Str({
      value,
      source: {
        start: {
          line: token[2],
          column: token[3]
        },
        end: {
          line: token[4],
          column: token[5]
        }
      },
      sourceIndex: token[6],
      quoted
    });

    node.raws.quote = quote;

    this.newNode(node);
    this.position++;
  }

  word () {
    return this.splitWord();
  }

  missingParenthesis () {
    return this.error('Expected opening parenthesis.');
  }

  newNode (node) {
    if (this.spaces) {
      node.raws.before += this.spaces;
      this.spaces = '';
    }

    return this.current.append(node);
  }

  get currToken () {
    return this.tokens[this.position];
  }

  get nextToken () {
    return this.tokens[this.position + 1];
  }

  get prevToken () {
    return this.tokens[this.position - 1];
  }
}
