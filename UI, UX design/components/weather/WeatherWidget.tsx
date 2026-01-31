import { motion } from 'framer-motion';
import {
  Sun,
  Cloud,
  CloudRain,
  CloudLightning,
  CloudSun,
  Droplets,
  Wind,
  Thermometer,
  Eye,
  Gauge,
  RefreshCw,
} from 'lucide-react';
import { useWeather, WeatherData } from '@/hooks/useWeather';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const getWeatherIcon = (condition: WeatherData['condition'], size = 'h-12 w-12') => {
  const iconClass = `${size} text-primary`;
  
  switch (condition) {
    case 'sunny':
      return <Sun className={`${size} text-amber-400`} />;
    case 'cloudy':
      return <Cloud className={`${size} text-slate-400`} />;
    case 'rainy':
      return <CloudRain className={`${size} text-blue-400`} />;
    case 'stormy':
      return <CloudLightning className={`${size} text-purple-400`} />;
    case 'partly-cloudy':
      return <CloudSun className={`${size} text-amber-300`} />;
    default:
      return <Sun className={iconClass} />;
  }
};

const getForecastIcon = (condition: WeatherData['condition']) => {
  return getWeatherIcon(condition, 'h-6 w-6');
};

interface WeatherWidgetProps {
  compact?: boolean;
}

export const WeatherWidget = ({ compact = false }: WeatherWidgetProps) => {
  const { weather, loading, refetch } = useWeather();

  if (loading || !weather) {
    return (
      <div className="glass-card p-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <motion.div
        className="glass-card p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getWeatherIcon(weather.condition, 'h-10 w-10')}
            <div>
              <p className="text-2xl font-bold text-foreground">{weather.temperature}°C</p>
              <p className="text-sm text-muted-foreground capitalize">{weather.condition.replace('-', ' ')}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">{weather.location}</p>
            <div className="flex items-center gap-2 mt-1">
              <Droplets className="h-3 w-3 text-blue-400" />
              <span className="text-xs text-muted-foreground">{weather.humidity}%</span>
              <Wind className="h-3 w-3 text-slate-400 ml-2" />
              <span className="text-xs text-muted-foreground">{weather.windSpeed} km/h</span>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="glass-card p-6 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Weather</h3>
          <p className="text-sm text-muted-foreground">{weather.location}</p>
        </div>
        <Button variant="ghost" size="icon" onClick={refetch}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Current Weather */}
      <div className="flex items-center gap-6">
        <div className="relative">
          {getWeatherIcon(weather.condition)}
          <div className="absolute -bottom-1 -right-1 bg-card rounded-full p-1">
            <span className="text-xs font-medium text-muted-foreground">
              {weather.condition === 'rainy' && '💧'}
              {weather.condition === 'sunny' && '☀️'}
              {weather.condition === 'cloudy' && '☁️'}
              {weather.condition === 'stormy' && '⛈️'}
              {weather.condition === 'partly-cloudy' && '⛅'}
            </span>
          </div>
        </div>
        <div>
          <p className="text-4xl font-bold text-foreground">{weather.temperature}°C</p>
          <p className="text-muted-foreground">Feels like {weather.feelsLike}°C</p>
          <p className="text-sm text-muted-foreground mt-1">{weather.description}</p>
        </div>
      </div>

      {/* Weather Details Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
          <Droplets className="h-5 w-5 text-blue-400" />
          <div>
            <p className="text-sm font-medium text-foreground">{weather.humidity}%</p>
            <p className="text-xs text-muted-foreground">Humidity</p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
          <Wind className="h-5 w-5 text-slate-400" />
          <div>
            <p className="text-sm font-medium text-foreground">{weather.windSpeed} km/h</p>
            <p className="text-xs text-muted-foreground">Wind {weather.windDirection}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
          <Sun className="h-5 w-5 text-amber-400" />
          <div>
            <p className="text-sm font-medium text-foreground">{weather.uvIndex}</p>
            <p className="text-xs text-muted-foreground">UV Index</p>
          </div>
        </div>
        <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
          <CloudRain className="h-5 w-5 text-blue-300" />
          <div>
            <p className="text-sm font-medium text-foreground">{weather.precipitation}%</p>
            <p className="text-xs text-muted-foreground">Precipitation</p>
          </div>
        </div>
      </div>

      {/* 7-Day Forecast */}
      <div>
        <h4 className="text-sm font-medium text-foreground mb-3">7-Day Forecast</h4>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {weather.forecast.map((day, index) => (
            <motion.div
              key={day.date}
              className={`flex-shrink-0 p-3 rounded-lg text-center min-w-[70px] ${
                index === 0 ? 'bg-primary/10 border border-primary/20' : 'bg-muted/50'
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <p className="text-xs font-medium text-foreground">{day.day}</p>
              <div className="my-2 flex justify-center">
                {getForecastIcon(day.condition)}
              </div>
              <p className="text-sm font-bold text-foreground">{day.high}°</p>
              <p className="text-xs text-muted-foreground">{day.low}°</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Last Updated */}
      <p className="text-xs text-muted-foreground text-center">
        Last updated: {weather.lastUpdated.toLocaleTimeString()}
      </p>
    </motion.div>
  );
};

export default WeatherWidget;
