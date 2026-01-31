// Simulated data generator for ArgoLens
// In production, this would come from the FastAPI backend

export const generateSensorData = () => {
  const hour = new Date().getHours();
  
  // Simulate realistic daily fluctuations
  const tempBase = hour >= 10 && hour <= 16 ? 32 : 24;
  const humidityBase = hour >= 6 && hour <= 10 ? 75 : 55;
  
  return {
    soilMoisture: Math.round(35 + Math.random() * 30),
    soilPh: Number((6.0 + Math.random() * 1.0).toFixed(1)),
    temperature: Math.round(tempBase + (Math.random() * 6 - 3)),
    humidity: Math.round(humidityBase + (Math.random() * 20 - 10)),
    lightIntensity: hour >= 6 && hour <= 18 
      ? Math.round(40000 + Math.random() * 20000)
      : Math.round(100 + Math.random() * 200),
  };
};

export const calculateNDVI = (nir: number, red: number): number => {
  if (nir + red === 0) return 0;
  return (nir - red) / (nir + red);
};

export const calculateEVI = (nir: number, red: number, blue: number): number => {
  const denominator = nir + 6 * red - 7.5 * blue + 1;
  if (denominator === 0) return 0;
  return 2.5 * ((nir - red) / denominator);
};

export const generateCropHealth = () => {
  // Simulated satellite data (normalized 0-1)
  const nir = 0.7 + Math.random() * 0.25;
  const red = 0.1 + Math.random() * 0.15;
  const blue = 0.05 + Math.random() * 0.1;
  
  const ndvi = calculateNDVI(nir, red);
  const evi = calculateEVI(nir, red, blue);
  
  // Health score derived from vegetation indices
  const healthScore = Math.round(
    Math.min(100, Math.max(0, (ndvi * 80 + evi * 40)))
  );
  
  return { ndvi, evi, healthScore };
};

export const generatePestRisks = (
  humidity: number,
  temperature: number,
  ndvi: number
) => {
  const risks = [];
  
  // Fungal disease risk: High humidity + Low NDVI
  const fungalRisk = Math.round(
    Math.min(100, Math.max(0, 
      (humidity > 80 ? 40 : humidity > 60 ? 20 : 5) +
      (ndvi < 0.3 ? 50 : ndvi < 0.5 ? 25 : 5) +
      Math.random() * 10
    ))
  );
  
  // Aphid risk: Moderate temp + High humidity
  const aphidRisk = Math.round(
    Math.min(100, Math.max(0,
      (temperature >= 20 && temperature <= 30 ? 30 : 10) +
      (humidity > 70 ? 35 : 15) +
      Math.random() * 15
    ))
  );
  
  // Drought stress: High temp + Low moisture indicator
  const droughtRisk = Math.round(
    Math.min(100, Math.max(0,
      (temperature > 35 ? 50 : temperature > 30 ? 25 : 5) +
      (ndvi < 0.4 ? 35 : 10) +
      Math.random() * 10
    ))
  );
  
  risks.push({
    type: 'Fungal Disease',
    risk: fungalRisk,
    factors: humidity > 80 
      ? ['High Humidity (>80%)', 'Low NDVI'] 
      : ['Moderate Humidity'],
  });
  
  risks.push({
    type: 'Aphid Infestation',
    risk: aphidRisk,
    factors: ['Optimal Temp Range', humidity > 70 ? 'High Humidity' : 'Normal Humidity'],
  });
  
  risks.push({
    type: 'Drought Stress',
    risk: droughtRisk,
    factors: temperature > 35 
      ? ['High Temp (>35°C)', 'Heat Warning'] 
      : ['Normal Temperature'],
  });
  
  return risks;
};

export const generateAlerts = (
  sensorData: ReturnType<typeof generateSensorData>,
  pestRisks: ReturnType<typeof generatePestRisks>
) => {
  const alerts = [];
  const now = new Date();
  
  // Check for critical conditions
  if (sensorData.soilMoisture < 25) {
    alerts.push({
      id: 1,
      title: 'Low Soil Moisture',
      message: `Soil moisture at ${sensorData.soilMoisture}%. Consider irrigation.`,
      severity: 'warning' as const,
      timestamp: now.toLocaleString(),
    });
  }
  
  if (sensorData.temperature > 35) {
    alerts.push({
      id: 2,
      title: 'Heat Stress Warning',
      message: `Temperature at ${sensorData.temperature}°C. Crops may experience heat stress.`,
      severity: 'critical' as const,
      timestamp: now.toLocaleString(),
    });
  }
  
  const highRiskPest = pestRisks.find(r => r.risk > 60);
  if (highRiskPest) {
    alerts.push({
      id: 3,
      title: `High ${highRiskPest.type} Risk`,
      message: `Risk level at ${highRiskPest.risk}%. Consider preventive measures.`,
      severity: 'warning' as const,
      timestamp: now.toLocaleString(),
    });
  }
  
  if (alerts.length === 0) {
    alerts.push({
      id: 4,
      title: 'All Systems Normal',
      message: 'All sensors and AI predictions are within optimal ranges.',
      severity: 'success' as const,
      timestamp: now.toLocaleString(),
    });
  }
  
  return alerts;
};

export const generateWeatherForecast = () => {
  const days = ['Today', 'Tomorrow', 'Wed', 'Thu', 'Fri'];
  return days.map((day, i) => ({
    day,
    high: Math.round(28 + Math.random() * 8),
    low: Math.round(18 + Math.random() * 5),
    condition: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain'][
      Math.floor(Math.random() * 4)
    ],
    rainChance: Math.round(Math.random() * 60),
  }));
};
