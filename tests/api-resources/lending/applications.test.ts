// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/tests/api-resources/lending/applications.test.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Garbage from 'garbage';

const client = new Garbage({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource applications', () => {
  // Prism tests are disabled
  test.skip('submit: only required params', async () => {
    const responsePromise = client.lending.applications.submit({
      amount: 3369.535449899852,
      employmentData: { employer: 'string', monthlyIncome: 22.870503510263873 },
      loanType: 'BUSINESS_EXPANSION',
      termMonths: 7703,
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
  test.skip('submit: required and optional params', async () => {
    const response = await client.lending.applications.submit({
      amount: 3369.535449899852,
      employmentData: {
        employer: 'string',
        monthlyIncome: 22.870503510263873,
        tenureMonths: 5190,
      },
      loanType: 'BUSINESS_EXPANSION',
      termMonths: 7703,
      assets: [{}],
      collateralId: 'string',
      liabilities: [{}],
    });
  });

  // Prism tests are disabled
  test.skip('trackStatus', async () => {
    const responsePromise = client.lending.applications.trackStatus('string');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });
});
