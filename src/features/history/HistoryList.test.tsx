import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useWeatherStore } from '../../store/useWeatherStore';
import { HistoryList } from './HistoryList';
import type { HistoryItem } from '../../types';

vi.mock('../../store/useWeatherStore');
vi.mock('./HistoryItem', () => ({
  HistoryItem: ({ item }: { item: HistoryItem }) => (
    <div data-testid="history-item">{item.city}</div>
  ),
}));

const mockUseWeatherStore = vi.mocked(useWeatherStore);

function setupStore(history: HistoryItem[]) {
  mockUseWeatherStore.mockImplementation((selector) => selector({ history } as never));
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('HistoryList', () => {
  it('renders nothing when history is empty', () => {
    setupStore([]);
    const { container } = render(<HistoryList />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders "Recent Searches" heading when history has items', () => {
    setupStore([{ city: 'London', searchedAt: Date.now() }]);
    render(<HistoryList />);
    expect(screen.getByRole('heading', { name: /recent searches/i })).toBeInTheDocument();
  });

  it('renders one HistoryItem per history entry', () => {
    setupStore([
      { city: 'London', searchedAt: 1 },
      { city: 'Paris', searchedAt: 2 },
      { city: 'Tokyo', searchedAt: 3 },
    ]);
    render(<HistoryList />);
    expect(screen.getAllByTestId('history-item')).toHaveLength(3);
  });

  it('passes correct city data to each HistoryItem', () => {
    setupStore([
      { city: 'London', searchedAt: 1 },
      { city: 'Paris', searchedAt: 2 },
    ]);
    render(<HistoryList />);
    expect(screen.getByText('London')).toBeInTheDocument();
    expect(screen.getByText('Paris')).toBeInTheDocument();
  });
});
