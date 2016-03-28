import chai from 'chai';
import shallowDeepEqual from 'chai-shallow-deep-equal';
import Parser from '../lib/parser';

let expect = chai.expect;

describe('Parser → Parenthesis', () => {

  chai.use(shallowDeepEqual);

  let fixtures = [
    {
      it: 'should parse empty parens',
      test: '( )',
      expected: [
        { type: 'paren', value: '(', raws: { after: ' ' } },
        { type: 'paren', value: ')' }
      ]
    },
    {
      it: 'should parse simple parens',
      test: '( | )',
      expected: [
        { type: 'paren', value: '(' },
        { type: 'word', value: '|', raws: { before: ' ', after: ' ' } },
        { type: 'paren', value: ')' }
      ]
    },
    {
      it: 'should parse nested parens',
      test: '((()))',
      expected: [
        { type: 'paren', value: '(' },
        { type: 'paren', value: '(' },
        { type: 'paren', value: '(' },
        { type: 'paren', value: ')' },
        { type: 'paren', value: ')' },
        { type: 'paren', value: ')' }
      ]
    },
    {
      it: 'should parse functions in parens',
      test: '( calc(( ) ))word',
      expected: [
        { type: 'paren', value: '(' },
        { type: 'func', value: 'calc' },
        { type: 'paren', value: '(' },
        { type: 'paren', value: '(' },
        { type: 'paren', value: ')' },
        { type: 'paren', value: ')' },
        { type: 'paren', value: ')' },
        { type: 'word', value: 'word' }
      ]
    },
    {
      it: 'should parse parentheses correctly',
      test: 'fn1(fn2(255), fn3(.2)), fn4(fn5(255,.2), fn6)',
      expected: [
        { type: 'func', value: 'fn1' },
        { type: 'paren', value: '(' },
        { type: 'func', value: 'fn2' },
        { type: 'paren', value: '(' },
        { type: 'number', value: '255' },
        { type: 'paren', value: ')' },
        { type: 'comma', value: ',' },
        { type: 'func', value: 'fn3' },
        { type: 'paren', value: '(' },
        { type: 'number', value: '.2' },
        { type: 'paren', value: ')' },
        { type: 'paren', value: ')' },
        { type: 'comma', value: ',' },
        { type: 'func', value: 'fn4' },
        { type: 'paren', value: '(' },
        { type: 'func', value: 'fn5' },
        { type: 'paren', value: '(' },
        { type: 'number', value: '255' },
        { type: 'comma', value: ',' },
        { type: 'number', value: '.2' },
        { type: 'paren', value: ')' },
        { type: 'comma', value: ',' },
        { type: 'word', value: 'fn6' },
        { type: 'paren', value: ')' }
      ]
    }
  ];

  let failures = [
    {
      it: 'should throw on unclosed function',
      test: 'url( /gfx/img/bg.jpg '
    },
    {
      it: 'should throw on unclosed paren',
      test: '( ( ( ) '
    },
    {
      it: 'should throw on unclosed paren',
      test: '(0 32 word '
    },
    {
      it: 'should throw on unopened paren',
      test: '() )wo)rd)'
    }
  ];

  fixtures.forEach((fixture) => {
    it(fixture.it, () => {
      let ast = new Parser(fixture.test).parse();
      let index = 0;

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
