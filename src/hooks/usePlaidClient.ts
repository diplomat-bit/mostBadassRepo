// REPOSITORY SOURCE: diplomat-bit/my-appaibanking | PATH: diplomat-bit-my-appaibanking-43962ef/src/hooks/usePlaidClient.ts
================================================================================


import { useState } from 'react';

export const usePlaidClient = () => {
    return {
        isLoading: false,
        error: null,
        data: { apiVersion: '2020-09-14' },
        fetchItemGet: async (args?: any) => ({ item: {} }),
        fetchConsentEventsGet: async (args?: any) => ({ consent_events: [] }),
        fetchItemActivityList: async (args?: any) => ({ activities: [] }),
    };
};
