import { beforeEach, describe, expect, test } from '@jest/globals';
import apiClient from './apiClient';
import { clearAuthSession, saveAuthSession } from '../auth/authSession';

describe('apiClient auth interceptor', () => {
  beforeEach(() => {
    clearAuthSession();
    window.sessionStorage.clear();
  });

  test('attaches bearer token for protected requests', async () => {
    saveAuthSession({
      accessToken: 'jwt-token',
      tokenType: 'Bearer',
      expiresInSeconds: 3600,
      memberId: 1,
      name: 'Prashant',
      username: 'Prashant',
    });

    const handlers = (apiClient.interceptors.request as any).handlers;
    const fulfilledHandler = handlers[handlers.length - 1].fulfilled;

    const requestConfig = await fulfilledHandler({
      url: '/bookings',
      headers: {},
    });

    expect(requestConfig.headers.Authorization).toBe('Bearer jwt-token');
  });
});
