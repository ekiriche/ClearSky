import { MapPin, Thermometer, Wind, ArrowDown, ArrowUp } from 'lucide-react';
import { useWeatherStore } from '../../store/useWeatherStore';

export function WeatherDisplay() {
  const loading = useWeatherStore((s) => s.loading);
  const weather = useWeatherStore((s) => s.weather);

  if (loading) {
    return (
      <div
        data-testid="weather-skeleton"
        className="rounded-2xl bg-white border border-blue-100 shadow-md p-6 w-full max-w-md animate-pulse"
      >
        <div className="flex items-center gap-2 mb-4">
          <div className="h-5 w-5 bg-slate-200 rounded-full" />
          <div className="h-6 w-40 bg-slate-200 rounded-full" />
        </div>
        <div className="flex items-center gap-3 my-4">
          <div className="h-10 w-10 bg-slate-200 rounded-lg" />
          <div className="h-14 w-24 bg-slate-200 rounded-lg" />
        </div>
        <div className="h-4 w-32 bg-slate-200 rounded-full mb-4" />
        <div className="grid grid-cols-2 gap-3">
          <div className="h-4 w-20 bg-slate-200 rounded-full" />
          <div className="h-4 w-20 bg-slate-200 rounded-full" />
          <div className="h-4 w-20 bg-slate-200 rounded-full" />
          <div className="h-4 w-20 bg-slate-200 rounded-full" />
        </div>
      </div>
    );
  }

  if (!weather) {
    return null;
  }

  return (
    <div className="rounded-2xl bg-white border border-blue-100 shadow-md p-6 w-full max-w-md">
      <div className="flex items-center gap-2 mb-1">
        <MapPin className="h-5 w-5 text-blue-500" aria-hidden="true" />
        <h2 className="text-2xl font-semibold text-slate-700">{weather.city}</h2>
      </div>

      <div className="flex items-center gap-3 my-4">
        <Thermometer className="h-10 w-10 text-blue-400" aria-hidden="true" />
        <span className="text-6xl font-bold text-slate-800 leading-none">
          {Math.round(weather.temperature)}°
        </span>
      </div>

      <p className="text-base text-slate-500 capitalize mb-4">{weather.description}</p>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-1.5 text-sm text-slate-600">
          <ArrowDown className="h-4 w-4 text-blue-400" aria-hidden="true" />
          <span>Min: {Math.round(weather.tempMin)}°</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-slate-600">
          <ArrowUp className="h-4 w-4 text-blue-400" aria-hidden="true" />
          <span>Max: {Math.round(weather.tempMax)}°</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-slate-600">
          <Wind className="h-4 w-4 text-blue-400" aria-hidden="true" />
          <span>Wind: {weather.windSpeed} m/s</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-slate-600">
          <Thermometer className="h-4 w-4 text-blue-400" aria-hidden="true" />
          <span>Feels like: {Math.round(weather.feelsLike)}°</span>
        </div>
      </div>
    </div>
  );
}
