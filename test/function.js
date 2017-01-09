'use strict';

const chai = require('chai');
const shallowDeepEqual = require('chai-shallow-deep-equal');
const Parser = require('../lib/parser');

let expect = chai.expect;

describe('Parser → Function', () => {

  chai.use(shallowDeepEqual);

  let fixtures,
    failures;

  fixtures = [
    {
      it: 'should parse empty url function',
      test: 'url()',
      expected: [
        { type: 'func', value: 'url' },
        { type: 'paren', value: '(' },
        { type: 'paren', value: ')' }
      ]
    },
    {
      it: 'should parse url function',
      test: 'url( /gfx/img/bg.jpg )',
      expected: [
        { type: 'func', value: 'url' },
        { type: 'paren', value: '(' },
        { type: 'word', value: ' /gfx/img/bg.jpg ' },
        { type: 'paren', value: ')' }
      ]
    },
    {
      it: 'should  parse url function with quoted first argument',
      test: 'url("/gfx/img/bg.jpg" hello )',
      expected: [
        { type: 'func', value: 'url' },
        { type: 'paren', value: '(' },
        { type: 'string', value: '/gfx/img/bg.jpg', raws: { quote: '"' } },
        { type: 'word', value: 'hello' },
        { type: 'paren', value: ')' }
      ]
    },
    {
      it: 'should parse rgba function',
      test: 'rgba( 29, 439 , 29 )',
      expected: [
        { type: 'func', value: 'rgba' },
        { type: 'paren', value: '(' },
        { type: 'number', value: '29', raws: { before: ' ' } },
        { type: 'comma', value: ',' },
        { type: 'number', value: '439', raws: { before: ' ' } },
        { type: 'comma', value: ',', raws: { before: ' ' } },
        { type: 'number', value: '29', raws: { before: ' ' } },
        { type: 'paren', value: ')' }
      ]
    },
    {
      it: 'should parse nested calc functions',
      test: 'calc(((768px - 100vw) / 2) - 15px)',
      expected: [
        { type: 'func', value: 'calc' },
        { type: 'paren', value: '(' },
        { type: 'paren', value: '(' },
        { type: 'paren', value: '(' },
        { type: 'number', value: '768', unit: 'px' },
        { type: 'operator', value: '-' },
        { type: 'number', value: '100', unit: 'vw' },
        { type: 'paren', value: ')' },
        { type: 'operator', value: '/', raws: { before: ' ' } },
        { type: 'number', value: '2', raws: { before: ' ' } },
        { type: 'paren', value: ')' },
        { type: 'operator', value: '-', raws: { before: ' ' } },
        { type: 'number', value: '15', unit: 'px', raws: { before: ' ' } },
        { type: 'paren', value: ')' }
      ]
    },
    {
      it: 'should parse nested functions',
      test: 'bar(baz(black, 10%), 10%)',
      expected: [
        { type: 'func', value: 'bar' },
        { type: 'paren', value: '(' },
        { type: 'func', value: 'baz' },
        { type: 'paren', value: '(' },
        { type: 'word', value: 'black' },
        { type: 'comma', value: ',' },
        { type: 'number', value: '10' },
        { type: 'paren', value: ')' },
        { type: 'comma', value: ',' },
        { type: 'number', value: '10' },
        { type: 'paren', value: ')' }
      ]
    },
    {
      it: 'should parse a browser-prefix function',
      test: '-webkit-linear-gradient(0)',
      expected: [
        { type: 'func', value: '-webkit-linear-gradient' },
        { type: 'paren', value: '(' },
        { type: 'number', value: '0' },
        { type: 'paren', value: ')' }
      ]
    }
  ];

  failures = [{
    it: 'should not parse url function with missing closing paren',
    test: 'url( /gfx/img/bg.jpg '
  }];

  fixtures.forEach((fixture) => {
    it(fixture.it, () => {
      let ast = new Parser(fixture.test).parse(),
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

  failures.forEach((fixture) => {
    it(fixture.it, () => {
      expect(() => new Parser(fixture.test).parse()).to.throw(Error);
    });
  });

});
