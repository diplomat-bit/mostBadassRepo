// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/tests/api-resources/sustainability/offsets.test.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Garbage from 'garbage';

const client = new Garbage({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource offsets', () => {
  // Prism tests are disabled
  test.skip('purchaseCredits: only required params', async () => {
    const responsePromise = client.sustainability.offsets.purchaseCredits({
      projectId: 'string',
      tonnes: 5219.91816003216,
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
  test.skip('purchaseCredits: required and optional params', async () => {
    const response = await client.sustainability.offsets.purchaseCredits({
      projectId: 'string',
      tonnes: 5219.91816003216,
      paymentSourceId: 'string',
    });
  });

  // Prism tests are disabled
  test.skip('retireCredits: only required params', async () => {
    const responsePromise = client.sustainability.offsets.retireCredits({ certificateId: 'string' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('retireCredits: required and optional params', async () => {
    const response = await client.sustainability.offsets.retireCredits({ certificateId: 'string' });
  });
});
