import Parser   from './parser';
import AtWord   from './atword';
import Colon    from './colon';
import Comma    from './comma';
import Comment  from './comment';
import Func     from './function';
import Num   from './number';
import Operator from './operator';
import Paren    from './paren';
import Str      from './string';
import Value    from './value';
import Word     from './word';

let parser = function (source) {
  return new Parser(source);
};

parser.atword = function (opts) {
  return new AtWord(opts);
};

parser.colon = function (opts) {
  opts.value = opts.value || ':';
  return new Colon(opts);
};

parser.comma = function (opts) {
  opts.value = opts.value || ',';
  return new Comma(opts);
};

parser.comment = function (opts) {
  return new Comment(opts);
};

parser.func = function (opts) {
  return new Func(opts);
};

parser.number = function (opts) {
  return new Num(opts);
};

parser.operator = function (opts) {
  return new Operator(opts);
};

parser.paren = function (opts) {
  opts.value = opts.value || '(';
  return new Paren(opts);
};

parser.string = function (opts) {
  opts.quote = opts.quote || '\'';
  return new Str(opts);
};

parser.value = function (opts) {
  return new Value(opts);
};

parser.word = function (opts) {
  return new Word(opts);
};

export default parser;
