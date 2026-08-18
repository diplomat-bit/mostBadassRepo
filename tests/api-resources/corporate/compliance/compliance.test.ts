// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/tests/api-resources/corporate/compliance/compliance.test.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Garbage from 'garbage';

const client = new Garbage({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource compliance', () => {
  // Prism tests are disabled
  test.skip('screenMedia: only required params', async () => {
    const responsePromise = client.corporate.compliance.screenMedia({ query: 'string' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('screenMedia: required and optional params', async () => {
    const response = await client.corporate.compliance.screenMedia({ query: 'string', depth: 'shallow' });
  });

  // Prism tests are disabled
  test.skip('screenPep: only required params', async () => {
    const responsePromise = client.corporate.compliance.screenPep({ fullName: 'string' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('screenPep: required and optional params', async () => {
    const response = await client.corporate.compliance.screenPep({ fullName: 'string', dob: '1959-07-22' });
  });

  // Prism tests are disabled
  test.skip('screenSanctions: only required params', async () => {
    const responsePromise = client.corporate.compliance.screenSanctions({ entities: [{}, {}] });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('screenSanctions: required and optional params', async () => {
    const response = await client.corporate.compliance.screenSanctions({
      entities: [
        { country: 'string', name: 'string' },
        { country: 'string', name: 'string' },
      ],
      checkType: 'enhanced_due_diligence',
    });
  });
});
