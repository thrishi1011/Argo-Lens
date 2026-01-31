// User types
export interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  farm_name: string | null;
  farm_location: { lat: number; lng: number } | null;
  total_area: number;
  created_at: string;
  updated_at: string;
}

export type UserRole = 'farmer' | 'agronomist' | 'admin';

// GeoJSON types
export interface GeoJSONPolygon {
  type: 'Polygon';
  coordinates: number[][][];
}

// Field types
export interface Field {
  id: string;
  user_id: string;
  name: string;
  crop_type: string;
  area: number;
  geometry: GeoJSONPolygon | null;
  planting_date: string | null;
  created_at: string;
  updated_at: string;
}

// Sensor types
export interface SensorReading {
  id: string;
  field_id: string;
  soil_moisture: number | null;
  temperature: number | null;
  humidity: number | null;
  ph_level: number | null;
  nitrogen: number | null;
  phosphorus: number | null;
  potassium: number | null;
  light_intensity: number | null;
  recorded_at: string;
}

// Satellite data types
export interface SatelliteData {
  id: string;
  field_id: string;
  ndvi: number | null;
  evi: number | null;
  savi: number | null;
  cloud_cover: number | null;
  health_score: number | null;
  image_url: string | null;
  captured_at: string;
  processed_at: string;
}

// Alert types
export type AlertType = 'pest_risk' | 'disease_detected' | 'water_stress' | 'nutrient_deficiency' | 'weather_alert';
export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';

export interface Alert {
  id: string;
  user_id: string;
  field_id: string | null;
  type: AlertType;
  severity: SeverityLevel;
  title: string;
  description: string | null;
  metrics: Record<string, unknown> | null;
  recommendations: string[] | null;
  is_resolved: boolean;
  resolved_at: string | null;
  created_at: string;
}

// Prediction types
export interface Prediction {
  id: string;
  field_id: string;
  model_type: string;
  prediction: Record<string, unknown>;
  confidence: number | null;
  input_data: Record<string, unknown> | null;
  created_at: string;
}

// Chart data types
export interface ChartDataPoint {
  date: string;
  value: number;
}

// Weather types
export interface WeatherForecast {
  day: string;
  condition: string;
  high: number;
  low: number;
  rainChance: number;
  icon: string;
}
