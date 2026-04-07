import { WeatherSearch } from './features/weather/WeatherSearch';
import { WeatherDisplay } from './features/weather/WeatherDisplay';
import { HistoryList } from './features/history/HistoryList';
import { UndoToast } from './components/UndoToast';
import { Header } from './components/Header';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-sky-50 to-indigo-100 flex flex-col">
      <Header />
      <main className="flex flex-col items-center justify-start py-10 px-4 gap-6 ">
        <WeatherSearch />
        <WeatherDisplay />
        <HistoryList />
      </main>
      <UndoToast />
    </div>
  );
}

export default App;
