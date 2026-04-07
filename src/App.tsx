import { WeatherSearch } from './features/weather/WeatherSearch';
import { WeatherDisplay } from './features/weather/WeatherDisplay';
import { HistoryList } from './features/history/HistoryList';
import { UndoToast } from './components/UndoToast';
import { Header } from './components/Header';

function App() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-start pt-10 px-4 gap-6">
        <WeatherSearch />
        <WeatherDisplay />
        <HistoryList />
      </div>
      <UndoToast />
    </>
  );
}

export default App;
