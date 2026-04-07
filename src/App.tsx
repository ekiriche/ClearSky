import { WeatherSearch } from './features/weather/WeatherSearch';
import { WeatherDisplay } from './features/weather/WeatherDisplay';

function App() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-start pt-20 px-4 gap-6">
      <WeatherSearch />
      <WeatherDisplay />
    </div>
  );
}

export default App;
