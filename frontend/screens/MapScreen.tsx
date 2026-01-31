import { useState, useEffect, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Layers, Maximize2, Satellite, Activity, Droplets, RefreshCw } from 'lucide-react';
import Header from '@/components/layout/Header';
import ThreeBackground from '@/components/ThreeBackground';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useCropData } from '@/hooks/useCropData';
import { Skeleton } from '@/components/ui/skeleton';

import FieldDetailsPanel from '@/components/FieldDetailsPanel';

// Lazy load the map component
const LeafletMap = lazy(() => import('@/components/map/LeafletMap'));

const MapScreen = () => {
  const { fields, loading, refreshData } = useCropData();
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [showNDVI, setShowNDVI] = useState(true);
  const [showSensors, setShowSensors] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMapLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const getHealthColor = (healthScore: number) => {
    if (healthScore >= 80) return 'hsl(142, 76%, 36%)';
    if (healthScore >= 60) return 'hsl(142, 76%, 50%)';
    if (healthScore >= 40) return 'hsl(45, 93%, 47%)';
    return 'hsl(0, 84%, 60%)';
  };

  const getHealthLabel = (healthScore: number) => {
    if (healthScore >= 80) return 'Excellent';
    if (healthScore >= 60) return 'Good';
    if (healthScore >= 40) return 'Fair';
    return 'Poor';
  };

  const selectedFieldData = fields.find(f => f.id === selectedField);

  return (
    <div className="min-h-screen bg-background relative">
      <ThreeBackground />
      <Header title="Field Map" />



      <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <motion.aside
          className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-border bg-card p-4 overflow-y-auto"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Layer Controls */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Map Layers
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">NDVI Overlay</span>
                <Switch checked={showNDVI} onCheckedChange={setShowNDVI} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Sensor Locations</span>
                <Switch checked={showSensors} onCheckedChange={setShowSensors} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Field Labels</span>
                <Switch checked={showLabels} onCheckedChange={setShowLabels} />
              </div>
            </div>
          </div>

          {/* Field List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground">Fields ({fields.length})</h3>
              <Button variant="ghost" size="sm" onClick={refreshData} disabled={loading}>
                <RefreshCw className={`h-3 w-3 mr-1 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
            <div className="space-y-2">
              {fields.map((field, index) => (
                <motion.button
                  key={field.id}
                  onClick={() => setSelectedField(field.id === selectedField ? null : field.id)}
                  className={`w-full text-left rounded-lg p-3 transition-all duration-200 ${selectedField === field.id
                    ? 'bg-primary/10 border border-primary shadow-md'
                    : 'bg-muted/50 hover:bg-muted border border-transparent hover:border-border'
                    }`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-foreground">{field.name}</span>
                    <motion.span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: getHealthColor(field.health.healthScore) }}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>{field.area} acres</span>
                    <span>{field.cropType}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: getHealthColor(field.health.healthScore) }}
                        initial={{ width: 0 }}
                        animate={{ width: `${field.health.healthScore}%` }}
                        transition={{ duration: 0.8, delay: index * 0.1 }}
                      />
                    </div>
                    <span className="text-xs font-medium">{field.health.healthScore}%</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 pt-6 border-t border-border">
            <h3 className="text-sm font-semibold text-foreground mb-3">Health Legend</h3>
            <div className="space-y-2">
              {[
                { label: 'Excellent (80-100%)', color: 'hsl(142, 76%, 36%)' },
                { label: 'Good (60-80%)', color: 'hsl(142, 76%, 50%)' },
                { label: 'Fair (40-60%)', color: 'hsl(45, 93%, 47%)' },
                { label: 'Poor (0-40%)', color: 'hsl(0, 84%, 60%)' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <span
                    className="h-3 w-8 rounded"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-xs text-muted-foreground">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Map Info */}
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground">
              <Satellite className="h-3 w-3 inline mr-1" />
              Real satellite imagery from ESRI. Field boundaries overlaid with health data.
            </p>
          </div>
        </motion.aside>

        {/* Map Area */}
        <div className="flex-1 relative overflow-hidden">
          {/* Loading State */}
          {!mapLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-background z-20">
              <div className="flex flex-col items-center gap-4">
                <Satellite className="h-12 w-12 text-primary animate-pulse" />
                <p className="text-muted-foreground">Loading satellite imagery...</p>
              </div>
            </div>
          )}


          {/* Leaflet Map */}
          <Suspense fallback={
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <Skeleton className="w-full h-full" />
            </div>
          }>
            <LeafletMap
              fields={fields}
              selectedField={selectedField}
              onFieldSelect={setSelectedField}
              showNDVI={showNDVI}
              showSensors={showSensors}
              showLabels={showLabels}
            />
          </Suspense>

          {/* Animated Overlay for NDVI simulation */}
          <AnimatePresence>
            {showNDVI && (
              <motion.div
                className="absolute inset-0 pointer-events-none z-[400] opacity-30 mix-blend-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                exit={{ opacity: 0 }}
                style={{
                  background: 'radial-gradient(circle at 50% 50%, rgba(34, 197, 94, 0.4), transparent 70%)',
                }}
              >
                {/* Subtle pulsing animation to simulate living vegetation */}
                <motion.div
                  className="w-full h-full"
                  animate={{ opacity: [0.3, 0.4, 0.3] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  style={{
                    background: 'radial-gradient(circle at 30% 40%, rgba(34, 197, 94, 0.3), transparent 60%)'
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Animated Rain/Weather Overlay (Simulated) */}
          <div className="absolute inset-0 pointer-events-none z-[500] overflow-hidden">
            {/* Could add rain CSS here later */}
          </div>

          {/* Map Controls */}
          <motion.div
            className="absolute top-4 right-4 flex flex-col gap-2 z-[1000]"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              variant="secondary"
              size="icon"
              className="bg-card shadow-lg hover:shadow-xl transition-shadow"
              onClick={refreshData}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </motion.div>

          {/* Field Stats Summary */}
          <motion.div
            className="absolute top-4 left-4 glass-card p-3 z-[1000]"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center gap-4 text-sm">
              <div className="text-center">
                <p className="text-muted-foreground text-xs">Fields</p>
                <p className="font-bold text-foreground">{fields.length}</p>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="text-center">
                <p className="text-muted-foreground text-xs">Total Area</p>
                <p className="font-bold text-foreground">
                  {fields.reduce((sum, f) => sum + f.area, 0).toFixed(1)} ac
                </p>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="text-center">
                <p className="text-muted-foreground text-xs">Avg Health</p>
                <p className="font-bold text-primary">
                  {Math.round(fields.reduce((sum, f) => sum + f.health.healthScore, 0) / fields.length)}%
                </p>
              </div>
            </div>
          </motion.div>

          {/* Selected Field Info Panel */}
          {/* Selected Field Info Panel */}
          <AnimatePresence>
            {selectedFieldData && (
              <FieldDetailsPanel
                field={{
                  id: selectedFieldData.id,
                  name: selectedFieldData.name,
                  area: selectedFieldData.area,
                  crop: selectedFieldData.cropType,
                  ndvi: selectedFieldData.health.ndvi,
                  evi: selectedFieldData.health.evi,
                  savi: selectedFieldData.health.savi || 0
                }}
                onClose={() => setSelectedField(null)}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default MapScreen;