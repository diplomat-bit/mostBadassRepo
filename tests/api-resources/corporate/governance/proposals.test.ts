// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/tests/api-resources/corporate/governance/proposals.test.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Garbage from 'garbage';

const client = new Garbage({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource proposals', () => {
  // Prism tests are disabled
  test.skip('castVote: only required params', async () => {
    const responsePromise = client.corporate.governance.proposals.castVote('string', { decision: 'REJECT' });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('castVote: required and optional params', async () => {
    const response = await client.corporate.governance.proposals.castVote('string', {
      decision: 'REJECT',
      comment: 'string',
      signature: 'string',
    });
  });

  // Prism tests are disabled
  test.skip('createNew: only required params', async () => {
    const responsePromise = client.corporate.governance.proposals.createNew({
      actionType: 'LARGE_PAYMENT',
      payload: {},
      title: 'string',
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
  test.skip('createNew: required and optional params', async () => {
    const response = await client.corporate.governance.proposals.createNew({
      actionType: 'LARGE_PAYMENT',
      payload: {},
      title: 'string',
      description: 'string',
      votingPeriodHours: 24,
    });
  });

  // Prism tests are disabled
  test.skip('listActive', async () => {
    const responsePromise = client.corporate.governance.proposals.listActive();
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });
});
