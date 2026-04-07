import { Cloud } from 'lucide-react';

export function Header() {
  return (
    <header className="w-full bg-white border-b border-blue-100 shadow-sm px-6 py-4 flex items-center gap-3">
      <Cloud className="text-blue-500" size={28} aria-hidden="true" />
      <div>
        <h1 className="text-xl font-bold text-blue-600 leading-none">ClearSky</h1>
        <p className="text-xs text-slate-500 mt-0.5">Weather at a glance</p>
      </div>
    </header>
  );
}
