from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional, Dict, Any
from enum import Enum

class CropType(str, Enum):
    WHEAT = "wheat"
    CORN = "corn"
    RICE = "rice"
    SOYBEANS = "soybeans"
    BARLEY = "barley"
    COTTON = "cotton"

class RiskLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

class AlertSeverity(str, Enum):
    INFO = "info"
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

# Basic field information
class FieldBasicInfo(BaseModel):
    name: str
    area_acres: float
    crop_type: CropType
    planting_date: str
    expected_harvest: str
    soil_type: str
    irrigation_type: str
    coordinates: Dict[str, float]
    last_soil_test: Optional[str] = None
    rotation_history: Optional[List[str]] = None

# Vegetation indices
class VegetationIndices(BaseModel):
    current_ndvi: float
    current_evi: float
    ndvi_trend: str  # "improving", "declining", "stable"
    evi_trend: str
    health_score: float  # 0-100
    ndvi_history: List[float]
    evi_history: List[float]
    ndvi_interpretation: Optional[str] = None
    evi_interpretation: Optional[str] = None

# Sensor readings
class SensorReadings(BaseModel):
    soil_moisture: float  # percentage
    temperature: float    # Celsius
    humidity: float       # percentage
    soil_ph: float
    light_intensity: float  # lux
    wind_speed: float      # km/h
    rainfall_last_24h: float  # mm
    nutrient_n: float      # nitrogen percentage
    nutrient_p: float      # phosphorus percentage
    nutrient_k: float      # potassium percentage
    last_updated: datetime
    sensor_count: Optional[int] = None
    data_quality: Optional[str] = "good"

# Pest risk analysis
class PestRiskAnalysis(BaseModel):
    risk_level: RiskLevel
    risk_score: float  # 0-1
    top_threats: List[str]
    confidence: float  # 0-1
    last_outbreak: Optional[str] = None
    preventive_measures: List[str]
    treatment_suggestions: Optional[List[str]] = None

# Weather data
class WeatherData(BaseModel):
    current_temp: float
    current_humidity: float
    current_conditions: str
    forecast_next_24h: str
    rainfall_probability: float  # percentage
    wind_direction: str
    sunrise: str
    sunset: str
    uv_index: Optional[float] = None
    dew_point: Optional[float] = None

# Recommendations
class Recommendation(BaseModel):
    category: str  # irrigation, pest_control, fertilization, etc.
    priority: str  # low, medium, high, critical
    title: str
    description: str
    action: str
    estimated_cost: float
    estimated_roi: float  # return on investment multiplier
    timing: str  # immediate, 24h, 48h, 1 week
    status: Optional[str] = "pending"

# Alert summary
class AlertSummary(BaseModel):
    id: str
    title: str
    description: str
    severity: AlertSeverity
    status: str  # active, resolved, acknowledged
    created_at: datetime
    field_id: str

# Main response model
class FieldAnalysisResponse(BaseModel):
    field_id: str
    timestamp: datetime
    basic_info: FieldBasicInfo
    vegetation_indices: VegetationIndices
    sensor_readings: SensorReadings
    pest_risk_analysis: PestRiskAnalysis
    weather_data: WeatherData
    recommendations: List[Recommendation]
    active_alerts: List[AlertSummary]
    historical_trends: Optional[Dict[str, Any]] = None
    overall_status: Optional[str] = "healthy"
    next_inspection_date: Optional[str] = None
