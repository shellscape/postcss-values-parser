'use strict';

const chai = require('chai');
const shallowDeepEqual = require('chai-shallow-deep-equal');
const Parser = require('../lib/parser');

let expect = chai.expect;

describe('Parser → Comma', () => {

  chai.use(shallowDeepEqual);

  let fixtures = [
    {
      it: 'should parse comma',
      test: ' , ',
      expected: [
        { type: 'comma', value: ',', raws: { before: ' ', after: ' ' } }
      ]
    },
    {
      it: 'should parse comma and colon',
      test: ' , : ',
      expected: [
        { type: 'comma', value: ',', raws: { before: ' ' } },
        { type: 'colon', value: ':', raws: { before: ' ', after: ' ' } }
      ]
    },
    {
      it: 'should parse functions separated by a comma',
      test: 'url(foo/bar.jpg), url(`http://website.com/img.jpg)',
      expected: [
        { type: 'func', value: 'url' },
        { type: 'paren', value: '(' },
        { type: 'word', value: 'foo/bar.jpg' },
        { type: 'paren', value: ')' },
        { type: 'comma', value: ',' },
        { type: 'func', value: 'url', raws: { before: ' ' } },
        { type: 'paren', value: '(' },
        { type: 'word', value: '`http://website.com/img.jpg' },
        { type: 'paren', value: ')' }
      ]
    },
    {
      it: 'should parse at-words and commas separately',
      test: 'rgb(@a, @b, @c)',
      expected: [
        { type: 'func', value: 'rgb' },
        { type: 'paren', value: '(' },
        { type: 'atword', value: 'a' },
        { type: 'comma', value: ',' },
        { type: 'atword', value: 'b' },
        { type: 'comma', value: ',' },
        { type: 'atword', value: 'c' },
        { type: 'paren', value: ')' }
      ]
    }
  ];

  fixtures.forEach((fixture) => {
    it(fixture.it, () => {
      let ast = new Parser(fixture.test).parse(),
        index = 0;

      // reminder: .walk() flattens the entire node structure
      ast.first.walk((node) => {
        let expected = fixture.expected[index];

        if (expected) {
          expect(node).to.shallowDeepEqual(expected);
        }

        index ++;
      });
    });
  });

});
