// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/tests/stringifyQuery.test.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { Garbage } from 'garbage';

const { stringifyQuery } = Garbage.prototype as any;

describe(stringifyQuery, () => {
  for (const [input, expected] of [
    [{ a: '1', b: 2, c: true }, 'a=1&b=2&c=true'],
    [{ a: null, b: false, c: undefined }, 'a=&b=false'],
    [{ 'a/b': 1.28341 }, `${encodeURIComponent('a/b')}=1.28341`],
    [
      { 'a/b': 'c/d', 'e=f': 'g&h' },
      `${encodeURIComponent('a/b')}=${encodeURIComponent('c/d')}&${encodeURIComponent(
        'e=f',
      )}=${encodeURIComponent('g&h')}`,
    ],
  ]) {
    it(`${JSON.stringify(input)} -> ${expected}`, () => {
      expect(stringifyQuery(input)).toEqual(expected);
    });
  }

  for (const value of [[], {}, new Date()]) {
    it(`${JSON.stringify(value)} -> <error>`, () => {
      expect(() => stringifyQuery({ value })).toThrow(`Cannot stringify type ${typeof value}`);
    });
  }
});


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-node | ORIGINAL PATH: diplomat-bit-jocall3-node-fae6abf/tests/stringifyQuery.test.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { Jocall3 } from 'jocall3-node';

const { stringifyQuery } = Jocall3.prototype as any;

describe(stringifyQuery, () => {
  for (const [input, expected] of [
    [{ a: '1', b: 2, c: true }, 'a=1&b=2&c=true'],
    [{ a: null, b: false, c: undefined }, 'a=&b=false'],
    [{ 'a/b': 1.28341 }, `${encodeURIComponent('a/b')}=1.28341`],
    [
      { 'a/b': 'c/d', 'e=f': 'g&h' },
      `${encodeURIComponent('a/b')}=${encodeURIComponent('c/d')}&${encodeURIComponent(
        'e=f',
      )}=${encodeURIComponent('g&h')}`,
    ],
  ]) {
    it(`${JSON.stringify(input)} -> ${expected}`, () => {
      expect(stringifyQuery(input)).toEqual(expected);
    });
  }

  for (const value of [[], {}, new Date()]) {
    it(`${JSON.stringify(value)} -> <error>`, () => {
      expect(() => stringifyQuery({ value })).toThrow(`Cannot stringify type ${typeof value}`);
    });
  }
});


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-typescript | ORIGINAL PATH: diplomat-bit-jocall3-typescript-b730718/tests/stringifyQuery.test.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { Jocall3 } from 'jocall3-node';

const { stringifyQuery } = Jocall3.prototype as any;

describe(stringifyQuery, () => {
  for (const [input, expected] of [
    [{ a: '1', b: 2, c: true }, 'a=1&b=2&c=true'],
    [{ a: null, b: false, c: undefined }, 'a=&b=false'],
    [{ 'a/b': 1.28341 }, `${encodeURIComponent('a/b')}=1.28341`],
    [
      { 'a/b': 'c/d', 'e=f': 'g&h' },
      `${encodeURIComponent('a/b')}=${encodeURIComponent('c/d')}&${encodeURIComponent(
        'e=f',
      )}=${encodeURIComponent('g&h')}`,
    ],
  ]) {
    it(`${JSON.stringify(input)} -> ${expected}`, () => {
      expect(stringifyQuery(input)).toEqual(expected);
    });
  }

  for (const value of [[], {}, new Date()]) {
    it(`${JSON.stringify(value)} -> <error>`, () => {
      expect(() => stringifyQuery({ value })).toThrow(`Cannot stringify type ${typeof value}`);
    });
  }
});
