import type { WeatherData, WeatherError } from '../types';

type OWMResponse = {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
  };
  weather: Array<{ description: string; icon: string }>;
  wind: { speed: number };
};

function makeWeatherError(kind: WeatherError['kind']): WeatherError {
  const messages: Record<WeatherError['kind'], string> = {
    not_found: 'City not found. Try another name.',
    network: 'Unable to reach weather service.',
    rate_limit: 'Too many requests. Try again later.',
  };
  return { kind, message: messages[kind] };
}

export async function fetchWeather(city: string): Promise<WeatherData> {
  const apiKey = import.meta.env.VITE_WEATHER_API_KEY as string;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;

  let response: Response;
  try {
    response = await fetch(url);
  } catch {
    throw makeWeatherError('network');
  }

  if (!response.ok) {
    if (response.status === 404) throw makeWeatherError('not_found');
    if (response.status === 429) throw makeWeatherError('rate_limit');
    throw makeWeatherError('network');
  }

  const data = (await response.json()) as OWMResponse;

  return {
    city: data.name,
    temperature: data.main.temp,
    feelsLike: data.main.feels_like,
    description: data.weather[0].description,
    tempMin: data.main.temp_min,
    tempMax: data.main.temp_max,
    windSpeed: data.wind.speed,
    icon: data.weather[0].icon,
  };
}
