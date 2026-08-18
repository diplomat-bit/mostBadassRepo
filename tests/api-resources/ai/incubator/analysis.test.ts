// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/tests/api-resources/ai/incubator/analysis.test.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Garbage from 'garbage';

const client = new Garbage({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource analysis', () => {
  // Prism tests are disabled
  test.skip('competitors: only required params', async () => {
    const responsePromise = client.ai.incubator.analysis.competitors({ industry: 'string', niche: 'string' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('competitors: required and optional params', async () => {
    const response = await client.ai.incubator.analysis.competitors({ industry: 'string', niche: 'string' });
  });

  // Prism tests are disabled
  test.skip('swot: only required params', async () => {
    const responsePromise = client.ai.incubator.analysis.swot({ businessContext: 'string' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('swot: required and optional params', async () => {
    const response = await client.ai.incubator.analysis.swot({ businessContext: 'string' });
  });
});
