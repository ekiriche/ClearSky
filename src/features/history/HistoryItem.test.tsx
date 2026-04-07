import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HistoryItem } from './HistoryItem';
import { useWeatherStore } from '../../store/useWeatherStore';
import type { HistoryItem as HistoryItemType } from '../../types';

vi.mock('../../store/useWeatherStore');
const mockUseWeatherStore = vi.mocked(useWeatherStore);

type StoreSlice = {
  searchCity: ReturnType<typeof vi.fn>;
  removeHistoryItem: ReturnType<typeof vi.fn>;
};

function setupStore(overrides: Partial<StoreSlice> = {}): StoreSlice {
  const store: StoreSlice = {
    searchCity: overrides.searchCity ?? vi.fn().mockResolvedValue(undefined),
    removeHistoryItem: overrides.removeHistoryItem ?? vi.fn(),
  };
  mockUseWeatherStore.mockImplementation((selector) => selector(store as never));
  return store;
}

const mockItem: HistoryItemType = {
  city: 'London',
  searchedAt: new Date('2026-04-07T14:34:00').getTime(),
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('HistoryItem', () => {
  it('renders the city name', () => {
    setupStore();
    render(<HistoryItem item={mockItem} />);
    expect(screen.getByRole('button', { name: 'London' })).toBeInTheDocument();
  });

  it('renders the formatted timestamp', () => {
    setupStore();
    render(<HistoryItem item={mockItem} />);
    expect(screen.getByText(/Apr 7, 2026/)).toBeInTheDocument();
  });

  it('calls searchCity with the city when the city button is clicked', async () => {
    const { searchCity } = setupStore();
    const user = userEvent.setup();
    render(<HistoryItem item={mockItem} />);
    await user.click(screen.getByRole('button', { name: 'London' }));
    expect(searchCity).toHaveBeenCalledOnce();
    expect(searchCity).toHaveBeenCalledWith('London');
  });

  it('calls removeHistoryItem with the city when the remove button is clicked', async () => {
    const { removeHistoryItem } = setupStore();
    const user = userEvent.setup();
    render(<HistoryItem item={mockItem} />);
    await user.click(screen.getByRole('button', { name: 'Remove London' }));
    expect(removeHistoryItem).toHaveBeenCalledOnce();
    expect(removeHistoryItem).toHaveBeenCalledWith('London');
  });

  it('does not call removeHistoryItem when the city button is clicked', async () => {
    const { removeHistoryItem } = setupStore();
    const user = userEvent.setup();
    render(<HistoryItem item={mockItem} />);
    await user.click(screen.getByRole('button', { name: 'London' }));
    expect(removeHistoryItem).not.toHaveBeenCalled();
  });

  it('does not call searchCity when the remove button is clicked', async () => {
    const { searchCity } = setupStore();
    const user = userEvent.setup();
    render(<HistoryItem item={mockItem} />);
    await user.click(screen.getByRole('button', { name: 'Remove London' }));
    expect(searchCity).not.toHaveBeenCalled();
  });
});
