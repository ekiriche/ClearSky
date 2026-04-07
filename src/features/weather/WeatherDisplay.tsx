import { MapPin, Thermometer, Wind, ArrowDown, ArrowUp, CloudSun } from 'lucide-react';
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 bg-slate-200 rounded-full" />
            <div className="h-8 w-40 bg-slate-200 rounded-full" />
          </div>
          <div className="flex items-center gap-1">
            <div className="h-14 w-14 bg-slate-200 rounded-lg" />
            <div className="h-[52px] w-20 bg-slate-200 rounded-lg" />
          </div>
        </div>
        <div className="h-6 w-32 bg-slate-200 rounded-full mt-2 mb-4" />
        <div className="border-t border-slate-100 pt-4 grid grid-cols-2 gap-3">
          <div className="h-5 w-20 bg-slate-200 rounded-full" />
          <div className="h-5 w-20 bg-slate-200 rounded-full" />
          <div className="h-5 w-20 bg-slate-200 rounded-full" />
          <div className="h-5 w-20 bg-slate-200 rounded-full" />
        </div>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="flex flex-col items-center gap-2 py-10 text-slate-400 w-full max-w-md">
        <CloudSun className="h-12 w-12 text-slate-300" aria-hidden="true" />
        <p className="text-sm">Search a city to see the weather</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white border border-blue-100 shadow-md p-6 w-full max-w-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-blue-500" aria-hidden="true" />
          <h2 className="text-2xl font-semibold text-slate-700">{weather.city}</h2>
        </div>
        <div className="flex items-center gap-1">
          <img
            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
            alt={weather.description}
            className="h-14 w-14"
          />
          <span className="text-5xl font-bold text-slate-800 leading-none">
            {Math.round(weather.temperature)}°
          </span>
        </div>
      </div>

      <span className="inline-block bg-blue-50 text-blue-600 text-xs font-medium rounded-full px-3 py-1 capitalize mt-2 mb-4">
        {weather.description}
      </span>

      <div className="border-t border-slate-100 pt-4 grid grid-cols-2 gap-3">
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
