import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WeatherSearch } from './WeatherSearch';
import { useWeatherStore } from '../../store/useWeatherStore';

vi.mock('../../store/useWeatherStore');
const mockUseWeatherStore = vi.mocked(useWeatherStore);

type StoreSlice = {
  searchCity: ReturnType<typeof vi.fn>;
  loading: boolean;
  error: string | null;
};

function setupStore(overrides: Partial<StoreSlice> = {}): StoreSlice {
  const store: StoreSlice = {
    searchCity: overrides.searchCity ?? vi.fn().mockResolvedValue(undefined),
    loading: overrides.loading ?? false,
    error: overrides.error ?? null,
  };
  mockUseWeatherStore.mockImplementation((selector) => selector(store as never));
  return store;
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('WeatherSearch', () => {
  it('renders the input and search button', () => {
    setupStore();
    render(<WeatherSearch />);
    expect(screen.getByPlaceholderText('Enter city name')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });

  it('does not call searchCity on empty submit', async () => {
    const { searchCity } = setupStore();
    const user = userEvent.setup();
    render(<WeatherSearch />);
    await user.click(screen.getByRole('button', { name: 'Search' }));
    expect(searchCity).not.toHaveBeenCalled();
  });

  it('does not call searchCity on whitespace-only submit', async () => {
    const { searchCity } = setupStore();
    const user = userEvent.setup();
    render(<WeatherSearch />);
    await user.type(screen.getByPlaceholderText('Enter city name'), '   ');
    await user.keyboard('{Enter}');
    expect(searchCity).not.toHaveBeenCalled();
  });

  it('calls searchCity with trimmed city on valid submit', async () => {
    const { searchCity } = setupStore();
    const user = userEvent.setup();
    render(<WeatherSearch />);
    await user.type(screen.getByPlaceholderText('Enter city name'), '  London  ');
    await user.keyboard('{Enter}');
    expect(searchCity).toHaveBeenCalledOnce();
    expect(searchCity).toHaveBeenCalledWith('London');
  });

  it('calls searchCity when the button is clicked', async () => {
    const { searchCity } = setupStore();
    const user = userEvent.setup();
    render(<WeatherSearch />);
    await user.type(screen.getByPlaceholderText('Enter city name'), 'Paris');
    await user.click(screen.getByRole('button', { name: 'Search' }));
    expect(searchCity).toHaveBeenCalledWith('Paris');
  });

  it('disables input and button while loading', () => {
    setupStore({ loading: true });
    render(<WeatherSearch />);
    expect(screen.getByPlaceholderText('Enter city name')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Searching…' })).toBeDisabled();
  });

  it('disables button when input is empty', () => {
    setupStore();
    render(<WeatherSearch />);
    expect(screen.getByRole('button', { name: 'Search' })).toBeDisabled();
  });

  it('enables button once input has non-whitespace text', async () => {
    setupStore();
    const user = userEvent.setup();
    render(<WeatherSearch />);
    await user.type(screen.getByPlaceholderText('Enter city name'), 'Tokyo');
    expect(screen.getByRole('button', { name: 'Search' })).toBeEnabled();
  });

  it('shows the error message from the store', () => {
    setupStore({ error: 'City not found. Try another name.' });
    render(<WeatherSearch />);
    expect(screen.getByRole('alert')).toHaveTextContent('City not found. Try another name.');
  });

  it('does not render an alert when error is null', () => {
    setupStore({ error: null });
    render(<WeatherSearch />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
