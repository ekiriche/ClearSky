import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WeatherSearch } from '../../features/weather/WeatherSearch';
import { WeatherDisplay } from '../../features/weather/WeatherDisplay';
import { HistoryList } from '../../features/history/HistoryList';
import { useWeatherStore } from '../../store/useWeatherStore';

const INITIAL_STATE = {
  weather: null,
  loading: false,
  error: null,
  history: [],
  lastRemoved: null,
};

function mockFetchSuccessWithCity(cityName: string) {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () =>
        Promise.resolve({
          name: cityName,
          main: { temp: 15, feels_like: 13, temp_min: 12, temp_max: 18 },
          weather: [{ description: 'clear sky', icon: '01d' }],
          wind: { speed: 5 },
        }),
    })
  );
}

function renderApp() {
  return render(
    <>
      <WeatherSearch />
      <WeatherDisplay />
      <HistoryList />
    </>
  );
}

beforeEach(() => {
  vi.stubEnv('VITE_WEATHER_API_KEY', 'test-key');
  localStorage.clear();
  useWeatherStore.setState(INITIAL_STATE);
  // Seed history: London is in the middle
  useWeatherStore.setState({
    history: [
      { city: 'Paris', searchedAt: 1000 },
      { city: 'London', searchedAt: 2000 },
      { city: 'Tokyo', searchedAt: 3000 },
    ],
  });
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('Duplicate search deduplication integration', () => {
  it('moves an existing city to the top of history on re-search', async () => {
    mockFetchSuccessWithCity('London');
    const user = userEvent.setup();
    renderApp();

    await user.type(screen.getByRole('textbox', { name: /city name/i }), 'London');
    await user.click(screen.getByRole('button', { name: 'Search' }));

    await screen.findByRole('region', { name: 'Weather for London' });

    const items = screen.getAllByRole('listitem');
    expect(items[0]).toHaveTextContent('London');
    expect(items[1]).toHaveTextContent('Paris');
    expect(items[2]).toHaveTextContent('Tokyo');
  });

  it('does not add a duplicate entry when the same city is re-searched', async () => {
    mockFetchSuccessWithCity('London');
    const user = userEvent.setup();
    renderApp();

    await user.type(screen.getByRole('textbox', { name: /city name/i }), 'London');
    await user.click(screen.getByRole('button', { name: 'Search' }));

    await screen.findByRole('region', { name: 'Weather for London' });

    expect(screen.getAllByRole('listitem')).toHaveLength(3);
  });

  it('deduplicates case-insensitively and moves the city to the top', async () => {
    // API returns proper casing regardless of how the user typed
    mockFetchSuccessWithCity('London');
    const user = userEvent.setup();
    renderApp();

    await user.type(screen.getByRole('textbox', { name: /city name/i }), 'london');
    await user.click(screen.getByRole('button', { name: 'Search' }));

    await screen.findByRole('region', { name: 'Weather for London' });

    const items = screen.getAllByRole('listitem');
    expect(items[0]).toHaveTextContent('London');
    expect(items).toHaveLength(3);
  });
});
