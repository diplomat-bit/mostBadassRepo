// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/tests/api-resources/web3/transactions.test.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Garbage from 'garbage';

const client = new Garbage({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource transactions', () => {
  // Prism tests are disabled
  test.skip('bridge: only required params', async () => {
    const responsePromise = client.web3.transactions.bridge({
      token: 'string',
      amount: 'string',
      destChain: 'string',
      sourceChain: 'string',
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
  test.skip('bridge: required and optional params', async () => {
    const response = await client.web3.transactions.bridge({
      token: 'string',
      amount: 'string',
      destChain: 'string',
      sourceChain: 'string',
    });
  });

  // Prism tests are disabled
  test.skip('initiate: only required params', async () => {
    const responsePromise = client.web3.transactions.initiate({
      amount: 8684.340121544215,
      asset: 'string',
      wallet_id: 'string',
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
  test.skip('initiate: required and optional params', async () => {
    const response = await client.web3.transactions.initiate({
      amount: 8684.340121544215,
      asset: 'string',
      wallet_id: 'string',
    });
  });

  // Prism tests are disabled
  test.skip('send: only required params', async () => {
    const responsePromise = client.web3.transactions.send({
      token: 'string',
      amount: 'string',
      to: 'string',
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
  test.skip('send: required and optional params', async () => {
    const response = await client.web3.transactions.send({
      token: 'string',
      amount: 'string',
      to: 'string',
    });
  });

  // Prism tests are disabled
  test.skip('swap: only required params', async () => {
    const responsePromise = client.web3.transactions.swap({
      amount: 'string',
      fromToken: 'string',
      toToken: 'string',
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
  test.skip('swap: required and optional params', async () => {
    const response = await client.web3.transactions.swap({
      amount: 'string',
      fromToken: 'string',
      toToken: 'string',
    });
  });
});


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-typescript | ORIGINAL PATH: diplomat-bit-jocall3-typescript-b730718/tests/api-resources/web3/transactions.test.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Jocall3 from 'jocall3-node';

const client = new Jocall3({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource transactions', () => {
  test('initiate', async () => {
    const responsePromise = client.web3.transactions.initiate({});
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });
});
