/*
  Copyright © 2018 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/
module.exports = {
  snapshot: [
    'url()',
    'url() foo bar baz',
    'url(var(foo))',
    'url( /gfx/img/bg.jpg )',
    "url( '/gfx/img/bg.jpg' )",
    'url( "/gfx/img/bg.jpg" )',
    "url( 'http://domain.com/gfx/img/bg.jpg' )",
    'url( "http://domain.com/gfx/img/bg.jpg" )',
    'url("/gfx/img/bg.jpg" hello )',
    'url("http://domain.com/gfx/img/bg.jpg" hello )',
    'url(http://123.example.com)',
    'url(//123.example.com)',
    'rgba( 29, 439 , 29 )',
    'RGBA( 29, 439 , 29 )',
    'RgBa( 29, 439 , 29 )',
    'Lab( 40%  56.6   39 )',
    'lCH(40% 68.8 34.5 / 50%)',
    'hwb(90deg 0% 0% / 0.5)',
    'calc(-0.5 * var(foo))',
    'calc(1px + -2vw - 4px)',
    'calc(((768px - 100vw) / 2) - 15px)',
    'bar(baz(black, 10%), 10%)',
    '-webkit-linear-gradient(0)',
    'var(--foo)',
    'var( --foo)',
    'var(--foo )',
    'var(  --foo   )',
    'var(--foo, default-value)',
    'rotate(72.3deg)',
    'rotate(0.5deg)',
    'rotate(.5deg)',
    'rotate(0.5rad)',
    'rotate(0.5grad)',
    'rotate(0.5turn)',
    '1em/var(--line-height)',
    'local(foo),local(bar)',
    'bat-man(#000)',
    'conic-gradient()'
  ],

  throws: ['url( /gfx/img/bg.jpg ']
};
