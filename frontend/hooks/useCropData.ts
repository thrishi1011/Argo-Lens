import { useState, useEffect, useCallback } from 'react';

interface CropHealthData {
  ndvi: number;
  evi: number;
  savi: number;
  healthScore: number;
  trend: 'improving' | 'stable' | 'declining';
  nitrogen: number;
  phosphorus: number;
  potassium: number;
}

interface FieldGeometry {
  type: string;
  coordinates: number[][][];
}

interface FieldData {
  id: string;
  name: string;
  area: number;
  cropType: string;
  growthStage: 'Germination' | 'Vegetative' | 'Flowering' | 'Fruiting' | 'Maturation';
  plantingDate: Date;
  health: CropHealthData;
  lastUpdated: Date;
  geometry: FieldGeometry;
  // For map rendering - SVG coordinates
  mapCoords: [number, number, number, number]; // x, y, width, height
}

// Calculate NDVI: (NIR - Red) / (NIR + Red)
const calculateNDVI = (nir: number, red: number): number => {
  if (nir + red === 0) return 0;
  return (nir - red) / (nir + red);
};

// Calculate EVI: 2.5 × (NIR - Red) / (NIR + 6×Red - 7.5×Blue + 1)
const calculateEVI = (nir: number, red: number, blue: number): number => {
  const denominator = nir + 6 * red - 7.5 * blue + 1;
  if (denominator === 0) return 0;
  return 2.5 * (nir - red) / denominator;
};

// Calculate SAVI: ((NIR - Red) / (NIR + Red + L)) × (1 + L), where L = 0.5
const calculateSAVI = (nir: number, red: number, L: number = 0.5): number => {
  const denominator = nir + red + L;
  if (denominator === 0) return 0;
  return ((nir - red) / denominator) * (1 + L);
};

// Calculate health score from indices (0-100)
const calculateHealthScore = (ndvi: number, evi: number): number => {
  // Weight NDVI more heavily as primary indicator
  const normalizedNDVI = ((ndvi + 1) / 2) * 100; // Convert -1 to 1 range to 0-100
  const normalizedEVI = ((evi + 1) / 2) * 100;

  const score = normalizedNDVI * 0.7 + normalizedEVI * 0.3;
  return Math.min(100, Math.max(0, Math.round(score)));
};

const generateFieldHealth = (): CropHealthData => {
  // Simulate satellite band readings
  const nir = 0.4 + Math.random() * 0.5; // 0.4 - 0.9
  const red = 0.05 + Math.random() * 0.15; // 0.05 - 0.2
  const blue = 0.02 + Math.random() * 0.08; // 0.02 - 0.1

  const ndvi = calculateNDVI(nir, red);
  const evi = calculateEVI(nir, red, blue);
  const savi = calculateSAVI(nir, red);
  const healthScore = calculateHealthScore(ndvi, evi);

  const trends: Array<'improving' | 'stable' | 'declining'> = ['improving', 'stable', 'declining'];
  const trend = trends[Math.floor(Math.random() * 3)];

  return {
    ndvi: Math.round(ndvi * 1000) / 1000,
    evi: Math.round(evi * 1000) / 1000,
    savi: Math.round(savi * 1000) / 1000,
    healthScore,
    trend,
    nitrogen: Math.round(150 + Math.random() * 100),
    phosphorus: Math.round(30 + Math.random() * 20),
    potassium: Math.round(180 + Math.random() * 70),
  };
};

const growthStages: Array<'Germination' | 'Vegetative' | 'Flowering' | 'Fruiting' | 'Maturation'> =
  ['Germination', 'Vegetative', 'Flowering', 'Fruiting', 'Maturation'];

const mockFields: FieldData[] = [
  {
    id: '1',
    name: 'Northwest Field',
    area: 45.5,
    cropType: 'Wheat',
    growthStage: 'Vegetative',
    plantingDate: new Date('2025-10-15'),
    health: generateFieldHealth(),
    lastUpdated: new Date(),
    geometry: { type: 'Polygon', coordinates: [[[20, 15], [200, 15], [200, 135], [20, 135], [20, 15]]] },
    mapCoords: [20, 15, 180, 120]
  },
  {
    id: '2',
    name: 'Southeast Field',
    area: 38.2,
    cropType: 'Corn',
    growthStage: 'Flowering',
    plantingDate: new Date('2025-09-20'),
    health: generateFieldHealth(),
    lastUpdated: new Date(),
    geometry: { type: 'Polygon', coordinates: [[[220, 140], [380, 140], [380, 240], [220, 240], [220, 140]]] },
    mapCoords: [220, 140, 160, 100]
  },
  {
    id: '3',
    name: 'Riverbank Field',
    area: 32.8,
    cropType: 'Soybeans',
    growthStage: 'Maturation',
    plantingDate: new Date('2025-08-10'),
    health: generateFieldHealth(),
    lastUpdated: new Date(),
    geometry: { type: 'Polygon', coordinates: [[[50, 180], [190, 180], [190, 260], [50, 260], [50, 180]]] },
    mapCoords: [50, 180, 140, 80]
  },
  {
    id: '4',
    name: 'Hilltop Field',
    area: 28.4,
    cropType: 'Cotton',
    growthStage: 'Vegetative',
    plantingDate: new Date('2025-11-01'),
    health: generateFieldHealth(),
    lastUpdated: new Date(),
    geometry: { type: 'Polygon', coordinates: [[[250, 30], [400, 30], [400, 120], [250, 120], [250, 30]]] },
    mapCoords: [250, 30, 150, 90]
  },
  {
    id: '5',
    name: 'Valley Field',
    area: 52.1,
    cropType: 'Rice',
    growthStage: 'Fruiting',
    plantingDate: new Date('2025-09-05'),
    health: generateFieldHealth(),
    lastUpdated: new Date(),
    geometry: { type: 'Polygon', coordinates: [[[420, 150], [550, 150], [550, 250], [420, 250], [420, 150]]] },
    mapCoords: [420, 150, 130, 100]
  },
  {
    id: '6',
    name: 'East Slope',
    area: 39.0,
    cropType: 'Corn',
    growthStage: 'Germination',
    plantingDate: new Date('2025-12-15'),
    health: generateFieldHealth(),
    lastUpdated: new Date(),
    geometry: { type: 'Polygon', coordinates: [[[320, 260], [480, 260], [480, 340], [320, 340], [320, 260]]] },
    mapCoords: [320, 260, 160, 80]
  },
];

export const useCropData = () => {
  const [fields, setFields] = useState<FieldData[]>(mockFields);
  const [loading, setLoading] = useState(false);

  const refreshData = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setFields(prev =>
        prev.map(field => ({
          ...field,
          health: generateFieldHealth(),
          lastUpdated: new Date(),
        }))
      );
      setLoading(false);
    }, 500);
  }, []);

  const getAverageHealth = useCallback((): number => {
    if (fields.length === 0) return 0;
    const total = fields.reduce((sum, field) => sum + field.health.healthScore, 0);
    return Math.round(total / fields.length);
  }, [fields]);

  const getTotalArea = useCallback((): number => {
    return fields.reduce((sum, field) => sum + field.area, 0);
  }, [fields]);

  // Periodically refresh data
  useEffect(() => {
    const interval = setInterval(refreshData, 30000);
    return () => clearInterval(interval);
  }, [refreshData]);

  return {
    fields,
    loading,
    refreshData,
    getAverageHealth,
    getTotalArea,
    calculateNDVI,
    calculateEVI,
    calculateSAVI,
  };
};

export default useCropData;
