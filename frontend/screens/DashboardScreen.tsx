import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Droplets,
  Thermometer,
  Sun,
  Wind,
  Sprout,
  Activity,
  CloudRain,
  TrendingUp,
  AlertTriangle,
  Leaf,
  Bug,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import StatCard from '@/components/dashboard/StatCard';
import ThreeBackground from '@/components/ThreeBackground';
import SensorCard from '@/components/dashboard/SensorCard';

// Specialized Agricultural Widgets
import CropHealthCard from '@/components/dashboard/CropHealthCard';
import SoilMoistureCard from '@/components/dashboard/SoilMoistureCard';
import PestRiskCard from '@/components/dashboard/PestRiskCard';

import LineChart from '@/components/charts/LineChart';
import WeatherWidget from '@/components/weather/WeatherWidget';
import {
  generateSensorData,
  generateCropHealth,
} from '@/lib/mockData';
import { useSensorData } from '@/hooks/useSensorData';
import { useCropData } from '@/hooks/useCropData';
import { useWeather } from '@/hooks/useWeather';

// AI Intelligence Engine
import { AgricultureAI, WeatherData, SoilData, CropData, PestRisk } from '@/lib/agricultureAI';

const DashboardScreen = () => {
  const { sensorData: liveSensorData, history } = useSensorData(5000);
  const { fields, getAverageHealth, getTotalArea } = useCropData();
  const { weather: liveWeather } = useWeather();

  // Local state for AI-driven insights
  const [aiPestRisks, setAiPestRisks] = useState<PestRisk[]>([]);
  const [cropHealthScore, setCropHealthScore] = useState(0);
  const [avgMoisture, setAvgMoisture] = useState(0);

  // Generate NDVI trend data
  const ndviTrendData = Array.from({ length: 30 }, (_, i) => ({
    date: `Day ${i + 1}`,
    value: 0.65 + Math.random() * 0.25,
  }));

  // AI Processing Effect
  useEffect(() => {
    if (!liveSensorData || !liveWeather) return;

    // 1. Prepare Data for AI Engine
    const weatherData: WeatherData = {
      temperature: liveSensorData.temperature,
      humidity: liveSensorData.humidity,
      precipitation: liveWeather.precipitation,
      windSpeed: liveWeather.windSpeed,
      windDirection: 'NW',
      cloudCover: 40
    };

    const soilData: SoilData = {
      moisture: liveSensorData.soilMoisture,
      ph: liveSensorData.phLevel,
      temperature: liveSensorData.temperature - 2, // Soil is cooler
      nitrogen: 180,
      phosphorus: 45,
      potassium: 200
    };

    const cropData: CropData = {
      type: 'Mixed',
      growthStage: 'Vegetative',
      plantingDate: new Date('2025-04-15')
    };

    // 2. Run AI Predictions
    const calculatedRisks = AgricultureAI.predictPestRisk(weatherData, soilData, cropData);
    setAiPestRisks(calculatedRisks);

    // 3. Calculate Health Score using AI formula (simulated spectral data)
    // In a real app, this comes from satellite API. Here we simulate spectral inputs relative to health.
    const simNIR = 0.8;
    const simRed = 0.1 + (Math.random() * 0.1); // Low red reflectance = healthy
    const simBlue = 0.05;

    const ndvi = AgricultureAI.calculateNDVI(simNIR, simRed);
    const evi = AgricultureAI.calculateEVI(simNIR, simRed, simBlue);
    const health = AgricultureAI.evaluateCropHealth(ndvi, evi);

    setCropHealthScore(health);
    setAvgMoisture(liveSensorData.soilMoisture);

  }, [liveSensorData, liveWeather]);

  const topPestRisk = aiPestRisks.length > 0 ? aiPestRisks[0] : { riskLevel: 'Low', pestType: 'None' } as PestRisk;

  return (
    <div className="relative min-h-screen bg-background">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <ThreeBackground />
      </div>

      <div className="relative z-10">
        <Header title="Farm Dashboard" />

        <div className="p-4 md:p-6 space-y-6">
          {/* AI Agricultural Metrics Section (Replacing Generic Stats) */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* 1. Crop Health AI Score */}
            <CropHealthCard score={cropHealthScore} trend={2.5} />

            {/* 2. Soil Moisture Status */}
            <SoilMoistureCard moisture={avgMoisture} status={avgMoisture < 40 ? 'Water Stress' : 'Optimal'} />

            {/* 3. AI Pest Risk Prediction */}
            <PestRiskCard riskLevel={topPestRisk.riskLevel} pestType={topPestRisk.pestType} />

            {/* 4. Weather Impact Card (Reusing StatCard but upgraded data) */}
            <StatCard
              title="Weather Status"
              value={`${Math.round(liveSensorData.temperature)}°C`}
              subtitle={liveWeather?.condition || 'Clear Sky'}
              icon={liveWeather?.precipitation > 0 ? CloudRain : Sun}
              color="accent"
              delay={0.3}
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Left Column: Field Analysis & Sensors */}
            <div className="lg:col-span-2 space-y-6">

              {/* NDVI Trend (Satellite Data) */}
              <motion.div
                className="glass-card p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Sprout className="h-5 w-5 text-green-500" />
                    <h3 className="text-lg font-semibold text-foreground">Vegetation Index (NDVI)</h3>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div> Healthy
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div> Stressed
                    </span>
                  </div>
                </div>
                <LineChart data={ndviTrendData} height={250} />
              </motion.div>

              {/* Real-time Sensor Grid */}
              <motion.div
                className="glass-card p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    IoT Sensor Readings
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-sm text-muted-foreground">Live Stream</span>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <SensorCard
                    title="Soil pH"
                    value={liveSensorData.phLevel}
                    unit=""
                    min={4}
                    max={9}
                    optimal={{ min: 6.0, max: 7.0 }}
                    icon={Activity}
                    delay={0.6}
                  />
                  <SensorCard
                    title="Ambient Temp"
                    value={Math.round(liveSensorData.temperature)}
                    unit="°C"
                    min={0}
                    max={50}
                    optimal={{ min: 20, max: 30 }}
                    icon={Thermometer}
                    delay={0.7}
                  />
                  <SensorCard
                    title="Humidity"
                    value={Math.round(liveSensorData.humidity)}
                    unit="%"
                    min={0}
                    max={100}
                    optimal={{ min: 50, max: 70 }}
                    icon={Wind}
                    delay={0.8}
                  />
                </div>
              </motion.div>
            </div>

            {/* Right Column: AI Insights & Weather */}
            <div className="space-y-6">

              {/* Weather Widget */}
              <WeatherWidget />

              {/* AI Recommendations List */}
              <motion.div
                className="glass-card p-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-primary" /> AI Agronomist Insights
                </h3>
                <div className="space-y-3">
                  {/* Dynamic Recommendations derived from our AI Engine could go here */}
                  {[
                    {
                      title: topPestRisk.riskLevel === 'High' ? 'Pest Control Needed' : 'Monitor Fields',
                      priority: topPestRisk.riskLevel === 'High' ? 'critical' : 'medium',
                      desc: topPestRisk.factors ? `Risk due to: ${topPestRisk.factors.join(', ')}` : 'Standard monitoring protocol active.'
                    },
                    {
                      title: avgMoisture < 40 ? 'Irrigation Advised' : 'Nutrient Check',
                      priority: avgMoisture < 40 ? 'high' : 'low',
                      desc: avgMoisture < 40 ? 'Moisture levels below optimal threshold.' : 'Nutrient balance optimal.'
                    },
                  ].map((rec, idx) => (
                    <div
                      key={idx}
                      className={`rounded-lg border p-3 transition-colors hover:bg-muted/50 ${rec.priority === 'critical' ? 'border-destructive/50 bg-destructive/5' :
                          rec.priority === 'high' ? 'border-accent/50 bg-accent/5' :
                            'border-border bg-muted/20'
                        }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <AlertTriangle className={`h-4 w-4 ${rec.priority === 'critical' ? 'text-destructive' :
                            rec.priority === 'high' ? 'text-accent' : 'text-muted-foreground'
                          }`} />
                        <span className="font-medium text-foreground">{rec.title}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{rec.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardScreen;
