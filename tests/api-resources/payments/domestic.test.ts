// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/tests/api-resources/payments/domestic.test.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Garbage from 'garbage';

const client = new Garbage({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource domestic', () => {
  // Prism tests are disabled
  test.skip('executeACH: only required params', async () => {
    const responsePromise = client.payments.domestic.executeACH({
      account: 'string',
      amount: 9587.708408938319,
      routing: 'string',
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
  test.skip('executeACH: required and optional params', async () => {
    const response = await client.payments.domestic.executeACH({
      account: 'string',
      amount: 9587.708408938319,
      routing: 'string',
    });
  });

  // Prism tests are disabled
  test.skip('executeRtp: only required params', async () => {
    const responsePromise = client.payments.domestic.executeRtp({
      amount: 856.3350923839752,
      recipientId: 'string',
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
  test.skip('executeRtp: required and optional params', async () => {
    const response = await client.payments.domestic.executeRtp({
      amount: 856.3350923839752,
      recipientId: 'string',
    });
  });

  // Prism tests are disabled
  test.skip('executeWire: only required params', async () => {
    const responsePromise = client.payments.domestic.executeWire({
      account: 'string',
      amount: 9587.708408938319,
      routing: 'string',
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
  test.skip('executeWire: required and optional params', async () => {
    const response = await client.payments.domestic.executeWire({
      account: 'string',
      amount: 9587.708408938319,
      routing: 'string',
    });
  });
});
