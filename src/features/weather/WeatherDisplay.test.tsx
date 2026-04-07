import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { WeatherDisplay } from './WeatherDisplay';
import { useWeatherStore } from '../../store/useWeatherStore';
import type { WeatherData } from '../../types';

vi.mock('../../store/useWeatherStore');
const mockUseWeatherStore = vi.mocked(useWeatherStore);

type StoreSlice = {
  loading: boolean;
  weather: WeatherData | null;
};

function setupStore(overrides: Partial<StoreSlice> = {}): void {
  const store: StoreSlice = {
    loading: overrides.loading ?? false,
    weather: overrides.weather ?? null,
  };
  mockUseWeatherStore.mockImplementation((selector) => selector(store as never));
}

const mockWeather: WeatherData = {
  city: 'London',
  temperature: 14.6,
  feelsLike: 12.1,
  description: 'light rain',
  tempMin: 11.0,
  tempMax: 17.2,
  windSpeed: 5.3,
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('WeatherDisplay', () => {
  it('renders nothing when weather is null and not loading', () => {
    setupStore({ loading: false, weather: null });
    const { container } = render(<WeatherDisplay />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders loading skeleton when loading is true', () => {
    setupStore({ loading: true, weather: null });
    render(<WeatherDisplay />);
    expect(screen.getByTestId('weather-skeleton')).toBeInTheDocument();
  });

  it('does not render skeleton when weather is loaded', () => {
    setupStore({ loading: false, weather: mockWeather });
    render(<WeatherDisplay />);
    expect(screen.queryByTestId('weather-skeleton')).not.toBeInTheDocument();
  });

  it('renders city name', () => {
    setupStore({ weather: mockWeather });
    render(<WeatherDisplay />);
    expect(screen.getByText('London')).toBeInTheDocument();
  });

  it('renders rounded temperature', () => {
    setupStore({ weather: mockWeather });
    render(<WeatherDisplay />);
    expect(screen.getByText('15°')).toBeInTheDocument();
  });

  it('renders description', () => {
    setupStore({ weather: mockWeather });
    render(<WeatherDisplay />);
    expect(screen.getByText('light rain')).toBeInTheDocument();
  });

  it('renders min temperature', () => {
    setupStore({ weather: mockWeather });
    render(<WeatherDisplay />);
    expect(screen.getByText('Min: 11°')).toBeInTheDocument();
  });

  it('renders max temperature', () => {
    setupStore({ weather: mockWeather });
    render(<WeatherDisplay />);
    expect(screen.getByText('Max: 17°')).toBeInTheDocument();
  });

  it('renders wind speed', () => {
    setupStore({ weather: mockWeather });
    render(<WeatherDisplay />);
    expect(screen.getByText('Wind: 5.3 m/s')).toBeInTheDocument();
  });

  it('renders feels like temperature', () => {
    setupStore({ weather: mockWeather });
    render(<WeatherDisplay />);
    expect(screen.getByText('Feels like: 12°')).toBeInTheDocument();
  });
});
