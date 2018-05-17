'use strict';

const chai = require('chai');
const Parser = require('../lib/parser');

const AtWord = require('../lib/atword');
const Colon = require('../lib/colon');
const Comma = require('../lib/comma');
const Comment = require('../lib/comment');
const Func = require('../lib/function');
const Numbr = require('../lib/number');
const Operator = require('../lib/operator');
const Paren = require('../lib/paren');
const Str = require('../lib/string');
const Word = require('../lib/word');

let expect = chai.expect;

describe('Parser → API', () => {

  it('should walk', () => {
    let source = '5px solid blue',
      ast = new Parser(source).parse(),
      expected = ['number', 'word', 'word'];

    ast.first.walk((node, index) => {
      expect(node.type).to.equal(expected[index]);
    });
  });

  it('should register walkers', () => {
    let source = '5px solid blue',
      ast = new Parser(source).parse(),
      expected = ['number', 'word', 'word'],
      types = [
        AtWord,
        Colon,
        Comma,
        Comment,
        Func,
        Numbr,
        Operator,
        Paren,
        Str,
        Word
      ];

    types.forEach((type) => {
      let name = 'walk' + type.name;

      if (name.lastIndexOf('s') !== name.length - 1) {
        name += 's';
      }

      expect(ast.first[name]).to.be.a('function');
    });
  });

  it('should walk a type string', () => {
    let source = '5px solid blue',
      ast = new Parser(source).parse(),
      expected = ['solid', 'blue'],
      index = 0;

    ast.first.walkType('word', (node) => {
      expect(node.value).to.equal(expected[index]);
      index ++;
    });
  });

  it('should walk a type constructor', () => {
    let source = '/*1*/ 5px /* 2 */',
      ast = new Parser(source).parse(),
      expected = ['1', ' 2 '],
      index = 0;

    expect(ast.first.walkComments).to.exist;

    ast.first.walkComments((node) => {
      expect(node.value).to.equal(expected[index]);
      index ++;
    });
  });
});
