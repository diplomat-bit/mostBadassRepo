// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/tests/api-resources/corporate/corporate.test.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Garbage from 'garbage';

const client = new Garbage({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource corporate', () => {
  // Prism tests are disabled
  test.skip('onboard: only required params', async () => {
    const responsePromise = client.corporate.onboard({
      entityType: 'CORP',
      jurisdiction: 'DE',
      legalName: 'string',
      taxId: 'string',
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
  test.skip('onboard: required and optional params', async () => {
    const response = await client.corporate.onboard({
      entityType: 'CORP',
      jurisdiction: 'DE',
      legalName: 'string',
      taxId: 'string',
      beneficialOwners: [
        {
          id: 'string',
          email: 'OJsMNh@jTCbAVwjqYWhGnyLe.nddf',
          identityVerified: false,
          name: 'string',
          address: {
            city: 'string',
            country: 'string',
            street: 'string',
            state: 'string',
            zip: 'string',
          },
          preferences: { key_0: 5595 },
          securityStatus: { lastLogin: '2010-09-16T07:13:38.157Z', twoFactorEnabled: true },
        },
        {
          id: 'string',
          email: 'VrwpDkjpFxkAg10@iRDWTgHNAzKDVkvGQrZ.ecv',
          identityVerified: true,
          name: 'string',
          address: {
            city: 'string',
            country: 'string',
            street: 'string',
            state: 'string',
            zip: 'string',
          },
          preferences: { key_0: 'string' },
          securityStatus: { lastLogin: '1992-06-26T10:35:43.370Z', twoFactorEnabled: false },
        },
      ],
    });
  });
});
