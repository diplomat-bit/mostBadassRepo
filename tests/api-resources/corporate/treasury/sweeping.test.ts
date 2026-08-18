// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/tests/api-resources/corporate/treasury/sweeping.test.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Garbage from 'garbage';

const client = new Garbage({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource sweeping', () => {
  // Prism tests are disabled
  test.skip('configureRules: only required params', async () => {
    const responsePromise = client.corporate.treasury.sweeping.configureRules({
      sourceAccount: 'string',
      targetAccount: 'string',
      threshold: 151.0206397332503,
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
  test.skip('configureRules: required and optional params', async () => {
    const response = await client.corporate.treasury.sweeping.configureRules({
      sourceAccount: 'string',
      targetAccount: 'string',
      threshold: 151.0206397332503,
      frequency: 'weekly',
    });
  });

  // Prism tests are disabled
  test.skip('executeSweep: only required params', async () => {
    const responsePromise = client.corporate.treasury.sweeping.executeSweep({ ruleId: 'string' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('executeSweep: required and optional params', async () => {
    const response = await client.corporate.treasury.sweeping.executeSweep({ ruleId: 'string' });
  });
});
