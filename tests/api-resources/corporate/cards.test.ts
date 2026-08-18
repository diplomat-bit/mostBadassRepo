// REPOSITORY SOURCE: diplomat-bit/garbage-typescript | PATH: diplomat-bit-garbage-typescript-95791a2/tests/api-resources/corporate/cards.test.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Garbage from 'garbage';

const client = new Garbage({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource cards', () => {
  // Prism tests are disabled
  test.skip('getTransactions', async () => {
    const responsePromise = client.corporate.cards.getTransactions('string');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('issueVirtualCard: only required params', async () => {
    const responsePromise = client.corporate.cards.issueVirtualCard({
      holderName: 'string',
      monthlyLimit: 4001.3564842481064,
      purpose: 'string',
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
  test.skip('issueVirtualCard: required and optional params', async () => {
    const response = await client.corporate.cards.issueVirtualCard({
      holderName: 'string',
      monthlyLimit: 4001.3564842481064,
      purpose: 'string',
      metadata: {},
    });
  });

  // Prism tests are disabled
  test.skip('listAll', async () => {
    const responsePromise = client.corporate.cards.listAll();
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('listAll: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.corporate.cards.listAll({ limit: 0, offset: 0 }, { path: '/_stainless_unknown_path' }),
    ).rejects.toThrow(Garbage.NotFoundError);
  });

  // Prism tests are disabled
  test.skip('requestPhysicalCard: only required params', async () => {
    const responsePromise = client.corporate.cards.requestPhysicalCard({
      holderName: 'string',
      shippingAddress: {
        city: 'string',
        country: 'string',
        street: 'string',
      },
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
  test.skip('requestPhysicalCard: required and optional params', async () => {
    const response = await client.corporate.cards.requestPhysicalCard({
      holderName: 'string',
      shippingAddress: {
        city: 'string',
        country: 'string',
        street: 'string',
        state: 'string',
        zip: 'string',
      },
    });
  });

  // Prism tests are disabled
  test.skip('toggleCardLock: only required params', async () => {
    const responsePromise = client.corporate.cards.toggleCardLock('string', { frozen: false });
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('toggleCardLock: required and optional params', async () => {
    const response = await client.corporate.cards.toggleCardLock('string', { frozen: false });
  });

  // Prism tests are disabled
  test.skip('updateControls', async () => {
    const responsePromise = client.corporate.cards.updateControls('string');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('updateControls: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.corporate.cards.updateControls(
        'string',
        {
          allowedCategories: ['string', 'string'],
          geoRestriction: ['string', 'string'],
          monthlyLimit: 4249.638841389152,
        },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(Garbage.NotFoundError);
  });
});
