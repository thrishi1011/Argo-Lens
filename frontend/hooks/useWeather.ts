import { useState, useEffect } from 'react';

export interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'partly-cloudy';
  description: string;
  uvIndex: number;
  visibility: number;
  pressure: number;
  feelsLike: number;
  precipitation: number;
  forecast: ForecastDay[];
  location: string;
  lastUpdated: Date;
}

export interface ForecastDay {
  day: string;
  date: string;
  high: number;
  low: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'partly-cloudy';
  precipitation: number;
  humidity: number;
}

// Simulate real weather data - in production, connect to OpenWeatherMap or similar API
const generateRealisticWeather = (): WeatherData => {
  const conditions: WeatherData['condition'][] = ['sunny', 'cloudy', 'rainy', 'partly-cloudy'];
  const condition = conditions[Math.floor(Math.random() * conditions.length)];
  
  const baseTemp = 22 + Math.random() * 10;
  const descriptions: Record<WeatherData['condition'], string> = {
    sunny: 'Clear skies with bright sunshine',
    cloudy: 'Overcast with thick cloud cover',
    rainy: 'Light to moderate rain expected',
    stormy: 'Thunderstorms with heavy rain',
    'partly-cloudy': 'Partly cloudy with some sun breaks',
  };

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  
  const forecast: ForecastDay[] = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    const dayConditions: WeatherData['condition'][] = ['sunny', 'cloudy', 'rainy', 'partly-cloudy'];
    
    return {
      day: days[date.getDay()],
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      high: Math.round(baseTemp + Math.random() * 5),
      low: Math.round(baseTemp - 5 - Math.random() * 5),
      condition: dayConditions[Math.floor(Math.random() * dayConditions.length)],
      precipitation: Math.round(Math.random() * 100),
      humidity: Math.round(50 + Math.random() * 40),
    };
  });

  return {
    temperature: Math.round(baseTemp),
    humidity: Math.round(50 + Math.random() * 40),
    windSpeed: Math.round(5 + Math.random() * 20),
    windDirection: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)],
    condition,
    description: descriptions[condition],
    uvIndex: Math.round(1 + Math.random() * 10),
    visibility: Math.round(8 + Math.random() * 7),
    pressure: Math.round(1010 + Math.random() * 20),
    feelsLike: Math.round(baseTemp + (Math.random() - 0.5) * 4),
    precipitation: condition === 'rainy' ? Math.round(20 + Math.random() * 60) : Math.round(Math.random() * 20),
    forecast,
    location: 'Iowa, USA',
    lastUpdated: new Date(),
  };
};

export const useWeather = (refreshInterval = 300000) => { // 5 min default
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async () => {
    try {
      setLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      const data = generateRealisticWeather();
      setWeather(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
    
    const interval = setInterval(fetchWeather, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);

  return { weather, loading, error, refetch: fetchWeather };
};
