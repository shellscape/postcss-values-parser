/** An Identifier is:
 * 1. Either,
 *    1.1. One dash; followed by,
 *         1.1.1. One letter, non-ASCII, underscore, dash; or,
 *         1.1.2. One escape slash; followed by,
 *              1.1.2.1 One non-newline;
 *         or,
 *    1.2. One letter, non-ASCII, underscore; or,
 *    1.3. One escape slash; followed by,
 *       1.3.1. One non-newline;
 *    then,
 * 2. Zero or more of;
 *    2.1 One letter, non-ASCII, underscore, dash; then / or,
 *    2.2 One escape slash; followed by,
 *        2.2.1. One non-newline.
 * @see https://drafts.csswg.org/css-syntax/#consume-ident-like-token
 */
exports.identifierRegExp = /^(-?(?:[-A-Z_a-z]|[^\x00-\x7F]|\\[^\n\f\r])(?:[-\w]|[^\x00-\x7F]|\\[^\n\f\r])*|%)$/; // eslint-disable-line no-control-regex

/** A Number is:
 * 1. None or one plus or minus symbol; then
 * 2. Either,
 *    2.1. One or more digits; and / or,
 *    2.2. One period symbol; followed by,
 *         2.2.1. One or more digits;
 *    then,
 * 3. If one "e" letter,
 *    3.1. One "e" letter; followed by,
 *         3.1.1. None or one plus or minus symbol; followed by,
 *                3.1.1.1. One or more digits.
 * @see https://drafts.csswg.org/css-syntax/#consume-a-number
 */
exports.numberRegex = /^([+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[Ee][+-]?\d+)?)$/;

/** A Numeric is:
 * 1. One Number; followed by,
 *    1.1 Zero or one Unit.
 */
exports.numericRegex = new RegExp(
  `^${exports.numberRegex.source.slice(1, -1) + exports.identifierRegExp.source.slice(1, -1)}?$`
);
