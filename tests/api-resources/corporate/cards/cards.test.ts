// REPOSITORY SOURCE: diplomat-bit/jocall3-node | PATH: diplomat-bit-jocall3-node-fae6abf/tests/api-resources/corporate/cards/cards.test.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Jocall3 from 'jocall3-node';
import { Response } from 'node-fetch';

const client = new Jocall3({
  apiKey: 'My API Key',
  geminiAPIKey: 'My Gemini API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource cards', () => {
  // Prism tests are disabled
  test.skip('list', async () => {
    const responsePromise = client.corporate.cards.list();
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('list: request options instead of params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(client.corporate.cards.list({ path: '/_stainless_unknown_path' })).rejects.toThrow(
      Jocall3.NotFoundError,
    );
  });

  // Prism tests are disabled
  test.skip('list: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.corporate.cards.list({ limit: 0, offset: 0 }, { path: '/_stainless_unknown_path' }),
    ).rejects.toThrow(Jocall3.NotFoundError);
  });

  // Prism tests are disabled
  test.skip('freeze', async () => {
    const responsePromise = client.corporate.cards.freeze('corp_card_xyz987654', {});
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Prism tests are disabled
  test.skip('issueVirtual: only required params', async () => {
    const responsePromise = client.corporate.cards.issueVirtual({
      controls: {
        atmWithdrawals: false,
        contactlessPayments: false,
        onlineTransactions: true,
        internationalTransactions: false,
        monthlyLimit: 1000,
        dailyLimit: 500,
        singleTransactionLimit: 200,
        merchantCategoryRestrictions: ['Advertising'],
        vendorRestrictions: ['Facebook Ads', 'Google Ads'],
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
  test.skip('issueVirtual: required and optional params', async () => {
    const response = await client.corporate.cards.issueVirtual({
      controls: {
        atmWithdrawals: false,
        contactlessPayments: false,
        onlineTransactions: true,
        internationalTransactions: false,
        monthlyLimit: 1000,
        dailyLimit: 500,
        singleTransactionLimit: 200,
        merchantCategoryRestrictions: ['Advertising'],
        vendorRestrictions: ['Facebook Ads', 'Google Ads'],
      },
    });
  });
});


================================================================================
// APPENDED FROM REPO: diplomat-bit/jocall3-typescript | ORIGINAL PATH: diplomat-bit-jocall3-typescript-b730718/tests/api-resources/corporate/cards/cards.test.ts
================================================================================

// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import Jocall3 from 'jocall3-node';

const client = new Jocall3({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource cards', () => {
  test('list', async () => {
    const responsePromise = client.corporate.cards.list();
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('list: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.corporate.cards.list({ limit: 0, offset: 0 }, { path: '/_stainless_unknown_path' }),
    ).rejects.toThrow(Jocall3.NotFoundError);
  });

  test('freeze', async () => {
    const responsePromise = client.corporate.cards.freeze('corp_card_xyz987654', {});
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('issueVirtual: only required params', async () => {
    const responsePromise = client.corporate.cards.issueVirtual({
      controls: {
        atmWithdrawals: false,
        contactlessPayments: false,
        onlineTransactions: true,
        internationalTransactions: false,
        monthlyLimit: 1000,
        dailyLimit: 500,
        singleTransactionLimit: 200,
        merchantCategoryRestrictions: ['Advertising'],
        vendorRestrictions: ['Facebook Ads', 'Google Ads'],
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

  test('issueVirtual: required and optional params', async () => {
    const response = await client.corporate.cards.issueVirtual({
      controls: {
        atmWithdrawals: false,
        contactlessPayments: false,
        onlineTransactions: true,
        internationalTransactions: false,
        monthlyLimit: 1000,
        dailyLimit: 500,
        singleTransactionLimit: 200,
        merchantCategoryRestrictions: ['Advertising'],
        vendorRestrictions: ['Facebook Ads', 'Google Ads'],
      },
    });
  });

  test('listTransactions', async () => {
    const responsePromise = client.corporate.cards.listTransactions('corp_card_xyz987654');
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  test('listTransactions: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.corporate.cards.listTransactions(
        'corp_card_xyz987654',
        {
          endDate: 'endDate',
          limit: 0,
          offset: 0,
          startDate: 'startDate',
        },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(Jocall3.NotFoundError);
  });
});
