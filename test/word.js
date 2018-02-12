'use strict';

const chai = require('chai');
const shallowDeepEqual = require('chai-shallow-deep-equal');
const Parser = require('../lib/parser');

let expect = chai.expect;

describe('Parser → Word', () => {

  chai.use(shallowDeepEqual);

  let fixtures = [
    {
      it: 'should parse font value',
      test: 'bold italic 12px \t /3 \'Open Sans\', Arial, "Helvetica Neue", sans-serif',
      expected: [
        { type: 'word', value: 'bold' },
        { type: 'word', value: 'italic', raws: { before: ' ' } },
        { type: 'number', value: '12', unit: 'px', raws: { before: ' ' } },
        { type: 'operator', value: '/', raws: { before: ' \t ' } },
        { type: 'number', value: '3', unit: '' },
        { type: 'string', value: 'Open Sans', raws: { before: ' ' } },
        { type: 'comma', value: ',' },
        { type: 'word', value: 'Arial', raws: { before: ' ' } },
        { type: 'comma', value: ',' },
        { type: 'string', value: 'Helvetica Neue', raws: { before: ' ' } },
        { type: 'comma', value: ',' },
        { type: 'word', value: 'sans-serif', raws: { before: ' ' } }
      ]
    },
    {
      it: 'should parse colons',
      test: '(min-width: 700px) and (orientation: \\$landscape)',
      expected: [
        { type: 'paren', value: '(' },
        { type: 'word', value: 'min-width' },
        { type: 'colon', value: ':' },
        { type: 'number', value: '700', unit: 'px', raws: { before: ' ' } },
        { type: 'paren', value: ')' },
        { type: 'word', value: 'and', raws: { before: ' ' } },
        { type: 'paren', value: '(', raws: { before: ' ' } },
        { type: 'word', value: 'orientation' },
        { type: 'colon', value: ':' },
        { type: 'word', value: '\\$landscape', raws: { before: ' ' } },
        { type: 'paren', value: ')' }
      ]
    },
    {
      it: 'should parse escaped spaces as word in fonts',
      test: 'Bond\\ 007',
      expected: [
        { type: 'word', value: 'Bond\\' },
        { type: 'number', value: '007', raws: { before: ' ' } }
      ]
    },
    {
      it: 'should parse custom variables',
      test: '--color',
      expected: [
        { type: 'word', value: '--color' }
      ]
    },
    {
      it: 'should parse browser prefixes',
      test: '-webkit-transition',
      expected: [
        { type: 'word', value: '-webkit-transition' }
      ]
    },
    {
      it: 'should parse hex colors',
      test: '#123 #f09f #abcdef #a2b3c4d5',
      expected: [
        { type: 'word', value: '#123', isHex: true, isColor: true },
        { type: 'word', value: '#f09f', isHex: true, isColor: true },
        { type: 'word', value: '#abcdef', isHex: true, isColor: true },
        { type: 'word', value: '#a2b3c4d5', isHex: true, isColor: true  }
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
