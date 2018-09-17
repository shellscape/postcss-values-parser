'use strict';

const expect = require('chai').expect;
const Parser = require('../lib/parser');
const ParserError = require('../lib/errors/ParserError');

describe('Parser → Number', () => {
  let fixtures = [
    {
      it: 'should clone an rgb function',
      test: 'rgb(255, 0, 0)',
      expected: [
        { type: 'func', value: 'rgb' },
        { type: 'paren', value: '(' },
        { type: 'number', value: '255' },
        { type: 'comma', value: ',' },
        { type: 'number', value: '0' },
        { type: 'comma', value: ',' },
        { type: 'number', value: '0' },
        { type: 'paren', value: ')' }
      ]
    }
  ];

  fixtures.forEach((fixture) => {
    it(fixture.it, () => {
      let ast = new Parser(fixture.test, { loose: fixture.loose }).parse().clone(),
        index = 0;

      ast.first.walk((node) => {
        let expected = fixture.expected[index];
        index ++;

        if (expected) {
          expect(node).to.shallowDeepEqual(expected);
        }
      });
    });
  });

});
