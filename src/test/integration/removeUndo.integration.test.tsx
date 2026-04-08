import { act, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HistoryList } from '../../features/history/HistoryList';
import { UndoToast } from '../../components/UndoToast';
import { useWeatherStore } from '../../store/useWeatherStore';

const SEEDED_HISTORY = [
  { city: 'Paris', searchedAt: 1000 },
  { city: 'London', searchedAt: 2000 },
  { city: 'Tokyo', searchedAt: 3000 },
];

function renderApp() {
  return render(
    <>
      <HistoryList />
      <UndoToast />
    </>
  );
}

beforeEach(() => {
  localStorage.clear();
  useWeatherStore.setState({
    weather: null,
    loading: false,
    error: null,
    history: SEEDED_HISTORY,
    lastRemoved: null,
  });
});

describe('Remove and undo flow integration', () => {
  describe('remove', () => {
    it('removes the item from the list when the remove button is clicked', async () => {
      const user = userEvent.setup();
      renderApp();

      await user.click(screen.getByRole('button', { name: /remove paris/i }));

      expect(within(screen.getByRole('list')).queryByText('Paris')).not.toBeInTheDocument();
    });

    it('shows the undo toast with the removed city name', async () => {
      const user = userEvent.setup();
      renderApp();

      await user.click(screen.getByRole('button', { name: /remove paris/i }));

      expect(screen.getByRole('status')).toHaveTextContent('Paris');
      expect(screen.getByRole('button', { name: /undo/i })).toBeInTheDocument();
    });

    it('hides the history section entirely when the last item is removed', async () => {
      const user = userEvent.setup();
      useWeatherStore.setState({ history: [{ city: 'Paris', searchedAt: 1000 }] });
      renderApp();

      await user.click(screen.getByRole('button', { name: /remove paris/i }));

      expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
    });
  });

  describe('undo', () => {
    it('restores the removed item to the list after clicking Undo', async () => {
      const user = userEvent.setup();
      renderApp();

      await user.click(screen.getByRole('button', { name: /remove paris/i }));
      await user.click(screen.getByRole('button', { name: /undo/i }));

      expect(screen.getByText('Paris')).toBeInTheDocument();
    });

    it('restores the item at its original position', async () => {
      const user = userEvent.setup();
      renderApp();

      await user.click(screen.getByRole('button', { name: /remove paris/i }));
      await user.click(screen.getByRole('button', { name: /undo/i }));

      const items = screen.getAllByRole('listitem');
      expect(items[0]).toHaveTextContent('Paris');
      expect(items[1]).toHaveTextContent('London');
      expect(items[2]).toHaveTextContent('Tokyo');
    });

    it('hides the toast after clicking Undo', async () => {
      const user = userEvent.setup();
      renderApp();

      await user.click(screen.getByRole('button', { name: /remove paris/i }));
      await user.click(screen.getByRole('button', { name: /undo/i }));

      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
  });

  describe('toast auto-dismiss', () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it('dismisses the toast automatically after 5 seconds', async () => {
      renderApp();

      // fireEvent is synchronous — avoids userEvent timer conflicts with fake timers
      fireEvent.click(screen.getByRole('button', { name: /remove paris/i }));
      expect(screen.getByRole('status')).toBeInTheDocument();

      await act(() => {
        vi.advanceTimersByTime(5000);
      });

      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    it('does not restore the removed item after auto-dismiss', async () => {
      renderApp();

      fireEvent.click(screen.getByRole('button', { name: /remove paris/i }));

      await act(() => {
        vi.advanceTimersByTime(5000);
      });

      expect(within(screen.getByRole('list')).queryByText('Paris')).not.toBeInTheDocument();
    });
  });
});
