import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { UndoToast } from './UndoToast';
import { useWeatherStore } from '../store/useWeatherStore';
import type { HistoryItem } from '../types';

vi.mock('../store/useWeatherStore');
const mockUseWeatherStore = vi.mocked(useWeatherStore);

type StoreSlice = {
  lastRemoved: { item: HistoryItem; index: number } | null;
  undoRemove: () => void;
  clearLastRemoved: () => void;
};

function setupStore(overrides: Partial<StoreSlice> = {}): StoreSlice {
  const store: StoreSlice = {
    lastRemoved: null,
    undoRemove: vi.fn(),
    clearLastRemoved: vi.fn(),
    ...overrides,
  };
  mockUseWeatherStore.mockImplementation((selector) => selector(store as never));
  return store;
}

const removedItem: HistoryItem = { city: 'London', searchedAt: 1000 };

beforeEach(() => {
  vi.clearAllMocks();
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('UndoToast', () => {
  it('renders nothing when lastRemoved is null', () => {
    setupStore({ lastRemoved: null });
    const { container } = render(<UndoToast />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the toast with city name and Undo button when lastRemoved is set', () => {
    setupStore({ lastRemoved: { item: removedItem, index: 0 } });
    render(<UndoToast />);
    const toast = screen.getByRole('status');
    expect(toast).toHaveAttribute('aria-live', 'polite');
    expect(toast).toHaveTextContent('London');
    expect(screen.getByRole('button', { name: 'Undo' })).toBeInTheDocument();
  });

  it('calls undoRemove when Undo button is clicked', () => {
    const { undoRemove } = setupStore({ lastRemoved: { item: removedItem, index: 0 } });
    render(<UndoToast />);
    fireEvent.click(screen.getByRole('button', { name: 'Undo' }));
    expect(undoRemove).toHaveBeenCalledOnce();
  });

  it('calls clearLastRemoved after 5 seconds', () => {
    const { clearLastRemoved } = setupStore({ lastRemoved: { item: removedItem, index: 0 } });
    render(<UndoToast />);
    vi.advanceTimersByTime(4999);
    expect(clearLastRemoved).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1);
    expect(clearLastRemoved).toHaveBeenCalledOnce();
  });

  it('restarts the timer when lastRemoved changes to a new item', () => {
    const { clearLastRemoved } = setupStore({ lastRemoved: { item: removedItem, index: 0 } });
    const { rerender } = render(<UndoToast />);

    vi.advanceTimersByTime(3000);
    expect(clearLastRemoved).not.toHaveBeenCalled();

    const newItem: HistoryItem = { city: 'Paris', searchedAt: 2000 };
    const newStore = setupStore({ lastRemoved: { item: newItem, index: 1 }, clearLastRemoved });
    rerender(<UndoToast />);

    // 5 more seconds from the new item — should fire exactly once
    vi.advanceTimersByTime(5000);
    expect(newStore.clearLastRemoved).toHaveBeenCalledOnce();
  });

  it('clears the timeout on unmount so clearLastRemoved is not called', () => {
    const { clearLastRemoved } = setupStore({ lastRemoved: { item: removedItem, index: 0 } });
    const { unmount } = render(<UndoToast />);
    unmount();
    vi.advanceTimersByTime(5000);
    expect(clearLastRemoved).not.toHaveBeenCalled();
  });
});
