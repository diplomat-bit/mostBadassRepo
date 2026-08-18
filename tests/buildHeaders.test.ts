// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/tests/buildHeaders.test.ts
================================================================================

import { inspect } from 'node:util';
import { buildHeaders, type HeadersLike, type NullableHeaders } from 'garbage/internal/headers';

function inspectNullableHeaders(headers: NullableHeaders) {
  return `NullableHeaders {${[
    ...[...headers.values.entries()].map(([name, value]) => ` ${inspect(name)}: ${inspect(value)}`),
    ...[...headers.nulls].map((name) => ` ${inspect(name)}: null`),
  ].join(', ')} }`;
}

describe('buildHeaders', () => {
  const cases: [HeadersLike[], string][] = [
    [[new Headers({ 'content-type': 'text/plain' })], `NullableHeaders { 'content-type': 'text/plain' }`],
    [
      [
        {
          'content-type': 'text/plain',
        },
        {
          'Content-Type': undefined,
        },
      ],
      `NullableHeaders { 'content-type': 'text/plain' }`,
    ],
    [
      [
        {
          'content-type': 'text/plain',
        },
        {
          'Content-Type': null,
        },
      ],
      `NullableHeaders { 'content-type': null }`,
    ],
    [
      [
        {
          cookie: 'name1=value1',
          Cookie: 'name2=value2',
        },
      ],
      `NullableHeaders { 'cookie': 'name2=value2' }`,
    ],
    [
      [
        {
          cookie: 'name1=value1',
          Cookie: undefined,
        },
      ],
      `NullableHeaders { 'cookie': 'name1=value1' }`,
    ],
    [
      [
        {
          cookie: ['name1=value1', 'name2=value2'],
        },
      ],
      `NullableHeaders { 'cookie': 'name1=value1; name2=value2' }`,
    ],
    [
      [
        {
          'x-foo': ['name1=value1', 'name2=value2'],
        },
      ],
      `NullableHeaders { 'x-foo': 'name1=value1, name2=value2' }`,
    ],
    [
      [
        [
          ['cookie', 'name1=value1'],
          ['cookie', 'name2=value2'],
          ['Cookie', 'name3=value3'],
        ],
      ],
      `NullableHeaders { 'cookie': 'name1=value1; name2=value2; name3=value3' }`,
    ],
    [[undefined], `NullableHeaders { }`],
    [[null], `NullableHeaders { }`],
  ];
  for (const [input, expected] of cases) {
    test(expected, () => {
      expect(inspectNullableHeaders(buildHeaders(input))).toEqual(expected);
    });
  }
});


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-typescript | ORIGINAL PATH: diplomat-bit-jocall3-typescript-b730718/tests/buildHeaders.test.ts
================================================================================

import { inspect } from 'node:util';
import { buildHeaders, type HeadersLike, type NullableHeaders } from 'jocall3-node/internal/headers';

function inspectNullableHeaders(headers: NullableHeaders) {
  return `NullableHeaders {${[
    ...[...headers.values.entries()].map(([name, value]) => ` ${inspect(name)}: ${inspect(value)}`),
    ...[...headers.nulls].map((name) => ` ${inspect(name)}: null`),
  ].join(', ')} }`;
}

describe('buildHeaders', () => {
  const cases: [HeadersLike[], string][] = [
    [[new Headers({ 'content-type': 'text/plain' })], `NullableHeaders { 'content-type': 'text/plain' }`],
    [
      [
        {
          'content-type': 'text/plain',
        },
        {
          'Content-Type': undefined,
        },
      ],
      `NullableHeaders { 'content-type': 'text/plain' }`,
    ],
    [
      [
        {
          'content-type': 'text/plain',
        },
        {
          'Content-Type': null,
        },
      ],
      `NullableHeaders { 'content-type': null }`,
    ],
    [
      [
        {
          cookie: 'name1=value1',
          Cookie: 'name2=value2',
        },
      ],
      `NullableHeaders { 'cookie': 'name2=value2' }`,
    ],
    [
      [
        {
          cookie: 'name1=value1',
          Cookie: undefined,
        },
      ],
      `NullableHeaders { 'cookie': 'name1=value1' }`,
    ],
    [
      [
        {
          cookie: ['name1=value1', 'name2=value2'],
        },
      ],
      `NullableHeaders { 'cookie': 'name1=value1; name2=value2' }`,
    ],
    [
      [
        {
          'x-foo': ['name1=value1', 'name2=value2'],
        },
      ],
      `NullableHeaders { 'x-foo': 'name1=value1, name2=value2' }`,
    ],
    [
      [
        [
          ['cookie', 'name1=value1'],
          ['cookie', 'name2=value2'],
          ['Cookie', 'name3=value3'],
        ],
      ],
      `NullableHeaders { 'cookie': 'name1=value1; name2=value2; name3=value3' }`,
    ],
    [[undefined], `NullableHeaders { }`],
    [[null], `NullableHeaders { }`],
  ];
  for (const [input, expected] of cases) {
    test(expected, () => {
      expect(inspectNullableHeaders(buildHeaders(input))).toEqual(expected);
    });
  }
});
