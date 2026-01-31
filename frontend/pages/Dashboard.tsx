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
  ArrowLeft,
} from 'lucide-react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatCard from '@/components/dashboard/StatCard';
import SensorCard from '@/components/dashboard/SensorCard';
import CropHealthGauge from '@/components/dashboard/CropHealthGauge';
import PestRiskChart from '@/components/dashboard/PestRiskChart';
import AlertCard from '@/components/dashboard/AlertCard';
import { Button } from '@/components/ui/button';
import {
  generateSensorData,
  generateCropHealth,
  generatePestRisks,
  generateAlerts,
  generateWeatherForecast,
} from '@/lib/mockData';

interface DashboardProps {
  onBack: () => void;
}

const Dashboard = ({ onBack }: DashboardProps) => {
  const [sensorData, setSensorData] = useState(generateSensorData());
  const [cropHealth, setCropHealth] = useState(generateCropHealth());
  const [pestRisks, setPestRisks] = useState<ReturnType<typeof generatePestRisks>>([]);
  const [alerts, setAlerts] = useState<ReturnType<typeof generateAlerts>>([]);
  const [weather] = useState(generateWeatherForecast());

  useEffect(() => {
    // Initial data generation
    const sensor = generateSensorData();
    const health = generateCropHealth();
    const risks = generatePestRisks(sensor.humidity, sensor.temperature, health.ndvi);
    const alertList = generateAlerts(sensor, risks);

    setSensorData(sensor);
    setCropHealth(health);
    setPestRisks(risks);
    setAlerts(alertList);

    // Simulate real-time updates
    const interval = setInterval(() => {
      const newSensor = generateSensorData();
      const newHealth = generateCropHealth();
      const newRisks = generatePestRisks(
        newSensor.humidity,
        newSensor.temperature,
        newHealth.ndvi
      );
      const newAlerts = generateAlerts(newSensor, newRisks);

      setSensorData(newSensor);
      setCropHealth(newHealth);
      setPestRisks(newRisks);
      setAlerts(newAlerts);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6"
        >
          <Button variant="ghost" onClick={onBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </motion.div>

        {/* Stats overview */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Active Sensors"
            value={12}
            subtitle="All operational"
            icon={Activity}
            color="primary"
            delay={0}
          />
          <StatCard
            title="Fields Monitored"
            value={4}
            subtitle="256 hectares total"
            icon={Sprout}
            color="secondary"
            delay={0.1}
          />
          <StatCard
            title="Avg. Health Score"
            value={`${cropHealth.healthScore}%`}
            icon={Sun}
            trend={{ value: 5, isPositive: true }}
            color="primary"
            delay={0.2}
          />
          <StatCard
            title="Rain Forecast"
            value={`${weather[0].rainChance}%`}
            subtitle="Next 24 hours"
            icon={CloudRain}
            color="accent"
            delay={0.3}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left column - Crop Health & Pest Risk */}
          <div className="space-y-6 lg:col-span-2">
            <div className="grid gap-6 md:grid-cols-2">
              <CropHealthGauge {...cropHealth} />
              <PestRiskChart risks={pestRisks} />
            </div>

            {/* Sensor Grid */}
            <motion.div
              className="glass-card p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h3 className="mb-4 text-lg font-semibold text-foreground">
                IoT Sensor Readings
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <SensorCard
                  title="Soil Moisture"
                  value={sensorData.soilMoisture}
                  unit="%"
                  min={0}
                  max={100}
                  optimal={{ min: 40, max: 70 }}
                  icon={Droplets}
                  delay={0.5}
                />
                <SensorCard
                  title="Soil pH"
                  value={sensorData.soilPh}
                  unit=""
                  min={4}
                  max={9}
                  optimal={{ min: 6.0, max: 7.0 }}
                  icon={Activity}
                  delay={0.6}
                />
                <SensorCard
                  title="Temperature"
                  value={sensorData.temperature}
                  unit="°C"
                  min={0}
                  max={50}
                  optimal={{ min: 20, max: 30 }}
                  icon={Thermometer}
                  delay={0.7}
                />
                <SensorCard
                  title="Humidity"
                  value={sensorData.humidity}
                  unit="%"
                  min={0}
                  max={100}
                  optimal={{ min: 50, max: 70 }}
                  icon={Wind}
                  delay={0.8}
                />
                <SensorCard
                  title="Light Intensity"
                  value={Math.round(sensorData.lightIntensity / 1000)}
                  unit="k lux"
                  min={0}
                  max={100}
                  optimal={{ min: 30, max: 80 }}
                  icon={Sun}
                  delay={0.9}
                />
              </div>
            </motion.div>
          </div>

          {/* Right column - Alerts & Weather */}
          <div className="space-y-6">
            {/* Alerts */}
            <motion.div
              className="glass-card p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="mb-4 text-lg font-semibold text-foreground">
                Recent Alerts
              </h3>
              <div className="space-y-3">
                {alerts.map((alert, i) => (
                  <AlertCard key={alert.id} {...alert} delay={0.4 + i * 0.1} />
                ))}
              </div>
            </motion.div>

            {/* Weather Forecast */}
            <motion.div
              className="glass-card p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <h3 className="mb-4 text-lg font-semibold text-foreground">
                5-Day Forecast
              </h3>
              <div className="space-y-3">
                {weather.map((day, i) => (
                  <motion.div
                    key={day.day}
                    className="flex items-center justify-between rounded-lg bg-muted/50 p-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                  >
                    <span className="font-medium text-foreground">
                      {day.day}
                    </span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">
                        {day.condition}
                      </span>
                      <div className="text-right">
                        <span className="font-medium text-foreground">
                          {day.high}°
                        </span>
                        <span className="text-muted-foreground">
                          /{day.low}°
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
