export type WeatherData = {
  city: string;
  temperature: number;
  feelsLike: number;
  description: string;
  tempMin: number;
  tempMax: number;
  windSpeed: number;
  icon: string;
};

export type HistoryItem = {
  city: string;
  searchedAt: number;
};

export type WeatherErrorKind = 'not_found' | 'network' | 'rate_limit' | 'no_api_key';

export type WeatherError = {
  kind: WeatherErrorKind;
  message: string;
};
