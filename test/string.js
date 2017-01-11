'use strict';

const chai = require('chai');
const shallowDeepEqual = require('chai-shallow-deep-equal');
const Parser = require('../lib/parser');

let expect = chai.expect;

describe('Parser → String', () => {

  chai.use(shallowDeepEqual);

  let fixtures,
    failures;

  fixtures = [
    {
      it: 'should parse empty quoted strings (")',
      test: '""',
      expected: [
        { type: 'string', value: '', quoted: true, raws: { quote: '"' } }
      ]
    },
    {
      it: 'should parse empty quoted strings (\')',
      test: '\'\'',
      expected: [
        { type: 'string', value: '', quoted: true, raws: { quote: '\'' } }
      ]
    },
    {
      it: 'should parse escaped quotes (\')',
      test: '\'word\\\'word\'',
      expected: [
        { type: 'string', value: 'word\\\'word', quoted: true, raws: { quote: '\'' } }
      ]
    },
    {
      it: 'should parse escaped quotes (\")',
      test: '"word\\"word"',
      expected: [
        { type: 'string', value: 'word\\"word', quoted: true, raws: { quote: '"' } }
      ]
    },
    {
      it: 'should parse single quotes inside double quotes (\')',
      test: '"word\'word"',
      expected: [
        { type: 'string', value: 'word\'word', quoted: true, raws: { quote: '"' } }
      ]
    },
    {
      it: 'should parse double quotes inside single quotes (\')',
      test: '\'word"word\'',
      expected: [
        { type: 'string', value: 'word"word', quoted: true, raws: { quote: '\'' } }
      ]
    },
    {
      it: 'should parse quoted strings',
      test: '"string"',
      expected: [
        { type: 'string', value: 'string', quoted: true, raws: { quote: '"' } }
      ]
    },
    {
      it: 'should parse quoted strings and words',
      test: 'word1"string"word2',
      expected: [
        { type: 'word', value: 'word1' },
        { type: 'string', value: 'string', quoted: true, raws: { quote: '"' } },
        { type: 'word', value: 'word2' }
      ]
    },
    {
      it: 'should parse quoted strings and spaces',
      test: ' "string" ',
      expected: [
        { type: 'string', value: 'string', quoted: true, raws: { before: ' ', after: ' ', quote: '"' } }
      ]
    }
  ];

  failures = [
    {
      it: 'should fail on unclosed quotes',
      test: '"word'
    },
    {
      it: 'should fail on unclosed quotes, with junk at the end',
      test: '"word\\'
    },
    {
      it: 'should fail on quote escaped outside of a string',
      test: ' \\"word\\\'\\ \\\t '
    }
  ];

  fixtures.forEach((fixture) => {
    it(fixture.it, () => {
      let ast = new Parser(fixture.test).parse();

      ast.first.walk((node, index) => {
        let expected = fixture.expected[index];

        if (expected) {
          expect(node).to.shallowDeepEqual(expected);
        }
      });
    });
  });

  failures.forEach((fixture) => {
    it(fixture.it, () => {
      expect(() => new Parser(fixture.test).parse()).to.throw(Error);
    });
  });

});
