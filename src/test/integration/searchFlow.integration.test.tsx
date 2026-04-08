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

const MOCK_OWM = {
  name: 'London',
  main: { temp: 15, feels_like: 13, temp_min: 12, temp_max: 18 },
  weather: [{ description: 'clear sky', icon: '01d' }],
  wind: { speed: 5 },
};

function mockFetchSuccess() {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(MOCK_OWM),
    })
  );
}

function mockFetchError(status: number) {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: false,
      status,
      json: () => Promise.resolve({}),
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
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('Search flow integration', () => {
  describe('successful search', () => {
    it('renders the weather card with city name after the fetch resolves', async () => {
      mockFetchSuccess();
      const user = userEvent.setup();
      renderApp();

      await user.type(screen.getByRole('textbox', { name: /city name/i }), 'London');
      await user.click(screen.getByRole('button', { name: 'Search' }));

      expect(await screen.findByRole('region', { name: 'Weather for London' })).toBeInTheDocument();
    });

    it('adds the searched city to the history list', async () => {
      mockFetchSuccess();
      const user = userEvent.setup();
      renderApp();

      await user.type(screen.getByRole('textbox', { name: /city name/i }), 'London');
      await user.click(screen.getByRole('button', { name: 'Search' }));

      await screen.findByRole('region', { name: 'Weather for London' });
      expect(screen.getByRole('listitem')).toHaveTextContent('London');
    });

    it('clears a prior error after a successful search', async () => {
      mockFetchSuccess();
      const user = userEvent.setup();
      useWeatherStore.setState({ error: 'City not found. Try another name.' });
      renderApp();

      expect(screen.getByRole('alert')).toBeInTheDocument();

      await user.type(screen.getByRole('textbox', { name: /city name/i }), 'London');
      await user.click(screen.getByRole('button', { name: 'Search' }));

      await screen.findByRole('region', { name: 'Weather for London' });
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  describe('failed search', () => {
    it('shows an error alert when the city is not found (404)', async () => {
      mockFetchError(404);
      const user = userEvent.setup();
      renderApp();

      await user.type(screen.getByRole('textbox', { name: /city name/i }), 'Nope');
      await user.click(screen.getByRole('button', { name: 'Search' }));

      expect(await screen.findByRole('alert')).toHaveTextContent(
        'City not found. Try another name.'
      );
    });

    it('does not add the city to history on a failed search', async () => {
      mockFetchError(404);
      const user = userEvent.setup();
      renderApp();

      await user.type(screen.getByRole('textbox', { name: /city name/i }), 'Nope');
      await user.click(screen.getByRole('button', { name: 'Search' }));

      await screen.findByRole('alert');
      expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
    });
  });
});
