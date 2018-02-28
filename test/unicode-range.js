'use strict';

const chai = require('chai');
const shallowDeepEqual = require('chai-shallow-deep-equal');
const Parser = require('../lib/parser');

let expect = chai.expect;

describe('Parser → Unicode range', () => {

  chai.use(shallowDeepEqual);

  let fixtures = [
    {
      it: 'should parse single codepoint',
      test: 'U+26',
      expected: [
        { type: 'unicode-range', value: 'U+26' },
      ]
    },
    {
      it: 'should parse other single codepoint',
      test: 'U+0-7F',
      expected: [
        { type: 'unicode-range', value: 'U+0-7F' },
      ]
    },
    {
      it: 'should parse codepoint range',
      test: 'U+0025-00FF',
      expected: [
        { type: 'unicode-range', value: 'U+0025-00FF' },
      ]
    },
    {
      it: 'should parse wildcard range',
      test: 'U+4??',
      expected: [
        { type: 'unicode-range', value: 'U+4??' },
      ]
    },
    {
      it: 'should parse multiple values',
      test: 'U+0025-00FF, U+4??',
      expected: [
        { type: 'unicode-range', value: 'U+0025-00FF' },
        { type: 'comma', value: ',', raws: { before: '', after: '' } },
        { type: 'unicode-range', value: 'U+4??', raws: { before: ' ', after: '' } },
      ]
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

});
