import chai from 'chai';
import shallowDeepEqual from 'chai-shallow-deep-equal';
import Parser from '../lib/parser';

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
