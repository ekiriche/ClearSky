import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchWeather } from './weatherService';
import type { WeatherData } from '../types';

const mockOWMResponse = {
  name: 'London',
  main: { temp: 15.5, feels_like: 13.2, temp_min: 12.0, temp_max: 18.0 },
  weather: [{ description: 'light rain' }],
  wind: { speed: 5.3 },
};

function mockFetch(status: number, body: unknown) {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: status >= 200 && status < 300,
      status,
      json: () => Promise.resolve(body),
    })
  );
}

beforeEach(() => {
  vi.unstubAllGlobals();
});

describe('fetchWeather', () => {
  it('maps a successful response to WeatherData', async () => {
    mockFetch(200, mockOWMResponse);

    const result: WeatherData = await fetchWeather('London');

    expect(result).toEqual({
      city: 'London',
      temperature: 15.5,
      feelsLike: 13.2,
      description: 'light rain',
      tempMin: 12.0,
      tempMax: 18.0,
      windSpeed: 5.3,
    });
  });

  it('throws not_found error on 404', async () => {
    mockFetch(404, {});

    await expect(fetchWeather('Nonexistent')).rejects.toMatchObject({
      kind: 'not_found',
      message: 'City not found. Try another name.',
    });
  });

  it('throws rate_limit error on 429', async () => {
    mockFetch(429, {});

    await expect(fetchWeather('London')).rejects.toMatchObject({
      kind: 'rate_limit',
      message: 'Too many requests. Try again later.',
    });
  });

  it('throws network error when fetch rejects', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Failed to fetch')));

    await expect(fetchWeather('London')).rejects.toMatchObject({
      kind: 'network',
      message: 'Unable to reach weather service.',
    });
  });

  it('throws network error on unexpected non-ok status', async () => {
    mockFetch(500, {});

    await expect(fetchWeather('London')).rejects.toMatchObject({
      kind: 'network',
      message: 'Unable to reach weather service.',
    });
  });
});
