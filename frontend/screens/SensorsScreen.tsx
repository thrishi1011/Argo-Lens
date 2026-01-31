import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Droplets,
  Thermometer,
  Wind,
  Sun,
  Activity,
  Gauge,
  Wifi,
  WifiOff,
  RefreshCw,
  Settings,
  Battery,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import ThreeBackground from '@/components/ThreeBackground';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import SensorCard from '@/components/dashboard/SensorCard';
import LineChart from '@/components/charts/LineChart';
import GaugeChart from '@/components/charts/GaugeChart';
import { useSensorData } from '@/hooks/useSensorData';

const sensorDevices = [
  { id: 's1', name: 'Sensor Node 1', location: 'Northwest Field', battery: 85, online: true },
  { id: 's2', name: 'Sensor Node 2', location: 'Southeast Field', battery: 72, online: true },
  { id: 's3', name: 'Sensor Node 3', location: 'Riverbank Field', battery: 93, online: true },
  { id: 's4', name: 'Sensor Node 4', location: 'Hilltop Field', battery: 45, online: false },
  { id: 's5', name: 'Sensor Node 5', location: 'Valley Field', battery: 68, online: true },
  { id: 's6', name: 'Weather Station', location: 'Central Hub', battery: 100, online: true },
];

const SensorsScreen = () => {
  const { sensorData, history, isLive, setIsLive } = useSensorData(3000);
  const [selectedSensor, setSelectedSensor] = useState<string | null>(null);

  // Generate historical data for charts
  const generateHistoricalData = (baseValue: number, variance: number) => {
    return Array.from({ length: 24 }, (_, i) => ({
      date: `${i}:00`,
      value: baseValue + (Math.random() - 0.5) * variance,
    }));
  };

  const temperatureHistory = generateHistoricalData(25, 8);
  const humidityHistory = generateHistoricalData(65, 20);
  const moistureHistory = generateHistoricalData(55, 15);

  return (
    <div className="min-h-screen bg-background relative">
      <ThreeBackground />
      <Header title="Sensors" />

      <div className="p-4 md:p-6 space-y-6">
        {/* Controls */}
        <motion.div
          className="glass-card p-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${isLive ? 'bg-primary animate-pulse' : 'bg-muted-foreground'}`} />
                <span className="text-sm font-medium text-foreground">
                  {isLive ? 'Live Updates' : 'Paused'}
                </span>
              </div>
              <Switch checked={isLive} onCheckedChange={setIsLive} />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Sync All
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Configure
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Real-time Readings */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Real-time Readings</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            <SensorCard
              title="Soil Moisture"
              value={Math.round(sensorData.soilMoisture)}
              unit="%"
              min={0}
              max={100}
              optimal={{ min: 40, max: 70 }}
              icon={Droplets}
              delay={0}
            />
            <SensorCard
              title="Soil pH"
              value={sensorData.phLevel}
              unit=""
              min={4}
              max={9}
              optimal={{ min: 6.0, max: 7.0 }}
              icon={Activity}
              delay={0.1}
            />
            <SensorCard
              title="Temperature"
              value={Math.round(sensorData.temperature)}
              unit="°C"
              min={0}
              max={50}
              optimal={{ min: 20, max: 30 }}
              icon={Thermometer}
              delay={0.2}
            />
            <SensorCard
              title="Humidity"
              value={Math.round(sensorData.humidity)}
              unit="%"
              min={0}
              max={100}
              optimal={{ min: 50, max: 70 }}
              icon={Wind}
              delay={0.3}
            />
            <SensorCard
              title="Light Intensity"
              value={Math.round(sensorData.lightIntensity / 1000)}
              unit="k lux"
              min={0}
              max={100}
              optimal={{ min: 30, max: 80 }}
              icon={Sun}
              delay={0.4}
            />
          </div>
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div
            className="glass-card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">Temperature (24h)</h3>
            <LineChart data={temperatureHistory} color="hsl(var(--destructive))" height={200} />
          </motion.div>

          <motion.div
            className="glass-card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">Humidity (24h)</h3>
            <LineChart data={humidityHistory} color="hsl(var(--secondary))" height={200} />
          </motion.div>

          <motion.div
            className="glass-card p-6 lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">Soil Moisture (24h)</h3>
            <LineChart data={moistureHistory} color="hsl(var(--primary))" height={200} />
          </motion.div>
        </div>

        {/* Nutrient Levels */}
        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-lg font-semibold text-foreground mb-6">Soil Nutrient Levels</h3>
          <div className="grid grid-cols-3 gap-8 justify-items-center">
            <div className="text-center">
              <GaugeChart
                value={sensorData.nitrogen}
                max={300}
                size={120}
                label="ppm"
                color="hsl(var(--primary))"
              />
              <p className="mt-2 font-medium text-foreground">Nitrogen (N)</p>
              <p className="text-sm text-muted-foreground">Optimal: 150-250 ppm</p>
            </div>
            <div className="text-center">
              <GaugeChart
                value={sensorData.phosphorus}
                max={100}
                size={120}
                label="ppm"
                color="hsl(var(--secondary))"
              />
              <p className="mt-2 font-medium text-foreground">Phosphorus (P)</p>
              <p className="text-sm text-muted-foreground">Optimal: 30-60 ppm</p>
            </div>
            <div className="text-center">
              <GaugeChart
                value={sensorData.potassium}
                max={300}
                size={120}
                label="ppm"
                color="hsl(var(--accent))"
              />
              <p className="mt-2 font-medium text-foreground">Potassium (K)</p>
              <p className="text-sm text-muted-foreground">Optimal: 150-250 ppm</p>
            </div>
          </div>
        </motion.div>

        {/* Sensor Devices */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">Connected Devices</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sensorDevices.map((device, index) => (
              <motion.div
                key={device.id}
                className={`glass-card p-4 cursor-pointer transition-colors ${
                  selectedSensor === device.id ? 'ring-2 ring-primary' : ''
                } ${!device.online ? 'opacity-60' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: device.online ? 1 : 0.6, y: 0 }}
                transition={{ delay: 0.1 * index }}
                onClick={() => setSelectedSensor(device.id === selectedSensor ? null : device.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`rounded-lg p-2 ${device.online ? 'bg-primary/10' : 'bg-muted'}`}>
                      <Gauge className={`h-5 w-5 ${device.online ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{device.name}</p>
                      <p className="text-xs text-muted-foreground">{device.location}</p>
                    </div>
                  </div>
                  {device.online ? (
                    <Wifi className="h-4 w-4 text-primary" />
                  ) : (
                    <WifiOff className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Battery className={`h-4 w-4 ${
                      device.battery > 50 ? 'text-primary' :
                      device.battery > 20 ? 'text-accent' : 'text-destructive'
                    }`} />
                    <span className="text-sm text-muted-foreground">{device.battery}%</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    device.online ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                  }`}>
                    {device.online ? 'Online' : 'Offline'}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SensorsScreen;
