// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/tests/api-resources/users/password-reset.test.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Garbage from 'garbage';

const client = new Garbage({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource passwordReset', () => {
  // Prism tests are disabled
  test.skip('confirm: only required params', async () => {
    const responsePromise = client.users.passwordReset.confirm({
      identifier: 'string',
      newPassword: 'string',
      verificationCode: 'string',
    });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('confirm: required and optional params', async () => {
    const response = await client.users.passwordReset.confirm({
      identifier: 'string',
      newPassword: 'string',
      verificationCode: 'string',
    });
  });

  // Prism tests are disabled
  test.skip('initiate: only required params', async () => {
    const responsePromise = client.users.passwordReset.initiate({ identifier: 'string' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('initiate: required and optional params', async () => {
    const response = await client.users.passwordReset.initiate({ identifier: 'string' });
  });
});


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-typescript | ORIGINAL PATH: diplomat-bit-jocall3-typescript-b730718/tests/api-resources/users/password-reset.test.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Jocall3 from 'jocall3-node';

const client = new Jocall3({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource passwordReset', () => {
  test('confirm: only required params', async () => {
    const responsePromise = client.users.passwordReset.confirm({
      identifier: 'reset.user@example.com',
      newPassword: 'MyNewStrongPassword@789',
      verificationCode: '654321',
    });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('confirm: required and optional params', async () => {
    const response = await client.users.passwordReset.confirm({
      identifier: 'reset.user@example.com',
      newPassword: 'MyNewStrongPassword@789',
      verificationCode: '654321',
    });
  });

  test('initiate: only required params', async () => {
    const responsePromise = client.users.passwordReset.initiate({ identifier: 'reset.user@example.com' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('initiate: required and optional params', async () => {
    const response = await client.users.passwordReset.initiate({ identifier: 'reset.user@example.com' });
  });
});
