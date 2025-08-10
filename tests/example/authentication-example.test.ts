/**
 * Integration test for authentication example
 */

import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

vi.mock('@fjell/http-api', () => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
}), { virtual: true });

import { get, post, put } from '@fjell/http-api';

import {
  apiKeyAuthenticationExample,
  bearerTokenAuthenticationExample,
  customAuthenticationExample,
  refreshTokenExample,
  sessionBasedAuthenticationExample
} from '../../examples/authentication-example';

describe('Authentication Example', () => {
  // Mock console methods to avoid cluttering test output
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => { });
    vi.spyOn(console, 'error').mockImplementation(() => { });
    get.mockReset();
    post.mockReset();
    put.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('apiKeyAuthenticationExample makes authenticated requests', async () => {
    get.mockResolvedValue({});
    await apiKeyAuthenticationExample();
    expect(get).toHaveBeenCalledTimes(2);
  });

  test('apiKeyAuthenticationExample handles errors', async () => {
    get.mockRejectedValueOnce(new Error('unauthorized'));

    await apiKeyAuthenticationExample();

    expect(console.error).toHaveBeenCalled();
  });

  test('bearerTokenAuthenticationExample makes authenticated requests', async () => {
    get.mockResolvedValueOnce({}).mockResolvedValueOnce({});
    post.mockResolvedValueOnce({});
    put.mockResolvedValueOnce({});
    await bearerTokenAuthenticationExample();
    expect(get).toHaveBeenCalled();
    expect(post).toHaveBeenCalled();
    expect(put).toHaveBeenCalled();
  });

  test('customAuthenticationExample supports multiple auth methods', async () => {
    get.mockResolvedValue({});
    post.mockResolvedValue({});
    await customAuthenticationExample();
    expect(get).toHaveBeenCalledTimes(2);
    expect(post).toHaveBeenCalledTimes(1);
  });

  test('sessionBasedAuthenticationExample performs login and logout', async () => {
    post.mockResolvedValueOnce({}).mockResolvedValueOnce({});
    get.mockResolvedValueOnce({});
    await sessionBasedAuthenticationExample();
    expect(post).toHaveBeenCalledTimes(2);
    expect(get).toHaveBeenCalledTimes(1);
  });

  test('refreshTokenExample refreshes and uses new token', async () => {
    post.mockResolvedValueOnce({ access_token: 'new-token' });
    get.mockResolvedValueOnce({});
    await refreshTokenExample();
    expect(post).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledTimes(1);
  });
});
