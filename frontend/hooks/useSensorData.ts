import { useState, useEffect, useCallback } from 'react';

interface SensorData {
  soilMoisture: number;
  temperature: number;
  humidity: number;
  phLevel: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  lightIntensity: number;
  timestamp: Date;
}

interface SensorHistory {
  value: number;
  time: Date;
}

// Simulate realistic sensor fluctuations based on time of day
const getTimeBasedMultiplier = (): { temp: number; light: number; humidity: number } => {
  const hour = new Date().getHours();

  // Temperature peaks around 2pm
  const tempMultiplier = 1 + 0.3 * Math.sin((hour - 6) * Math.PI / 12);

  // Light intensity peaks at noon
  const lightMultiplier = hour >= 6 && hour <= 18
    ? Math.sin((hour - 6) * Math.PI / 12)
    : 0.05;

  // Humidity inversely related to temperature
  const humidityMultiplier = 1 - 0.2 * Math.sin((hour - 6) * Math.PI / 12);

  return { temp: tempMultiplier, light: lightMultiplier, humidity: humidityMultiplier };
};

const generateReading = (current: number, min: number, max: number, drift: number) => {
  const change = (Math.random() - 0.5) * drift;
  const newVal = current + change;
  return Math.min(Math.max(newVal, min), max);
};

export const useSensorData = (updateInterval: number = 5000) => {
  const [sensorData, setSensorData] = useState<SensorData>({
    soilMoisture: 65,
    temperature: 24,
    humidity: 55,
    phLevel: 6.5,
    nitrogen: 180,
    phosphorus: 45,
    potassium: 210,
    lightIntensity: 50000,
    timestamp: new Date(),
  });

  const [history, setHistory] = useState<SensorHistory[]>([]);
  const [isLive, setIsLive] = useState(true);

  const updateSensorData = useCallback(() => {
    setSensorData(prev => {
      const multipliers = getTimeBasedMultiplier();
      const newData = {
        soilMoisture: generateReading(prev.soilMoisture, 30, 90, 1.5),
        temperature: generateReading(prev.temperature, 15, 35, 0.5) * multipliers.temp,
        humidity: generateReading(prev.humidity, 40, 85, 2) * multipliers.humidity,
        phLevel: generateReading(prev.phLevel, 5.5, 7.5, 0.05),
        nitrogen: generateReading(prev.nitrogen, 100, 250, 2),
        phosphorus: generateReading(prev.phosphorus, 20, 80, 1),
        potassium: generateReading(prev.potassium, 150, 250, 2),
        lightIntensity: Math.max(0, 80000 * multipliers.light + (Math.random() - 0.5) * 10000),
        timestamp: new Date(),
      };

      return newData;
    });
  }, []);

  useEffect(() => {
    setHistory(prev => {
      const newEntry = { value: sensorData.soilMoisture, time: new Date() };
      return [...prev.slice(-29), newEntry];
    });
  }, [sensorData.soilMoisture]);

  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(updateSensorData, updateInterval);
    return () => clearInterval(interval);
  }, [isLive, updateInterval, updateSensorData]);

  return { sensorData, history, isLive, setIsLive };
};

export default useSensorData;
