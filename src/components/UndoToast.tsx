import { useEffect } from 'react';
import { useWeatherStore } from '../store/useWeatherStore';

const TOAST_DURATION_MS = 5000;

export function UndoToast() {
  const lastRemoved = useWeatherStore((s) => s.lastRemoved);
  const undoRemove = useWeatherStore((s) => s.undoRemove);
  const clearLastRemoved = useWeatherStore((s) => s.clearLastRemoved);

  useEffect(() => {
    if (!lastRemoved) return;
    const id = window.setTimeout(clearLastRemoved, TOAST_DURATION_MS);
    return () => window.clearTimeout(id);
  }, [lastRemoved, clearLastRemoved]);

  if (!lastRemoved) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-4 z-50 flex items-center gap-3 rounded-lg bg-slate-800 px-4 py-3 text-sm text-white shadow-lg"
    >
      <span>
        Removed <span className="font-medium">{lastRemoved.item.city}</span>
      </span>
      <button
        onClick={undoRemove}
        className="rounded px-2 py-0.5 text-xs font-semibold text-blue-300 hover:text-blue-100 hover:bg-slate-700 transition-colors cursor-pointer"
      >
        Undo
      </button>
    </div>
  );
}
