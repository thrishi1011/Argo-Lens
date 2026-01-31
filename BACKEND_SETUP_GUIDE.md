# Plant Protector Backend - Setup & Implementation Guide

**Status:** NEEDS TO BE CREATED  
**Framework:** FastAPI (Python 3.9+)  
**Database:** Supabase PostgreSQL  
**Real-Time:** WebSocket + Server-Sent Events

---

## 🚀 QUICK START

### Prerequisites
```bash
# Install Python 3.9 or higher
python --version

# Create project directory
mkdir backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

### Initial Setup
```bash
# Create requirements.txt
pip install fastapi uvicorn pydantic python-dotenv python-multipart aiohttp pandas numpy

# Create .env file with Supabase credentials
# Copy from frontend/.env

# Run development server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

---

## 📁 PROJECT STRUCTURE TO CREATE

```
backend/
├── main.py                 # FastAPI application entry point
├── requirements.txt        # Python dependencies
├── .env                    # Environment variables
├── .gitignore             # Git ignore patterns
│
├── config/
│   ├── __init__.py
│   └── settings.py        # Configuration management
│
├── models/
│   ├── __init__.py
│   ├── crop_models.py     # Crop data models (Pydantic)
│   ├── sensor_models.py   # Sensor data models
│   ├── ai_models.py       # AI prediction models
│   └── alert_models.py    # Alert data models
│
├── services/
│   ├── __init__.py
│   ├── satellite_service.py    # NDVI/EVI calculation
│   ├── sensor_service.py       # Sensor data generation
│   ├── ai_service.py           # AI predictions
│   ├── weather_service.py      # Weather integration
│   ├── recommendation_service.py # Recommendation engine
│   ├── alert_service.py        # Alert generation
│   └── database_service.py     # Supabase integration
│
├── routes/
│   ├── __init__.py
│   ├── dashboard_routes.py     # Dashboard endpoints
│   ├── crop_routes.py          # Crop data endpoints
│   ├── sensor_routes.py        # Sensor data endpoints
│   ├── ai_routes.py            # AI prediction endpoints
│   ├── weather_routes.py       # Weather endpoints
│   ├── alerts_routes.py        # Alert endpoints
│   ├── fields_routes.py        # Field management endpoints
│   └── reports_routes.py       # Report generation endpoints
│
├── utils/
│   ├── __init__.py
│   ├── math_utils.py           # Mathematical functions
│   ├── data_generator.py       # Test data generation
│   ├── constants.py            # Application constants
│   └── validators.py           # Custom validators
│
├── websocket/
│   ├── __init__.py
│   └── connection_manager.py   # WebSocket management
│
└── tests/
    ├── __init__.py
    ├── test_api.py             # API endpoint tests
    ├── test_services.py        # Service tests
    └── test_models.py          # Model tests
```

---

## 📝 KEY FILES TO CREATE

### 1. `backend/main.py` - Application Entry Point

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="Plant Protector API",
    description="AI-powered agricultural intelligence platform",
    version="1.0.0"
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",  # Vite dev server
        "https://yourdomain.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Trusted hosts middleware
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["localhost", "127.0.0.1", "yourdomain.com"]
)

# Include routes
from routes import (
    dashboard_routes,
    crop_routes,
    sensor_routes,
    ai_routes,
    weather_routes,
    alerts_routes,
    fields_routes,
    reports_routes
)

app.include_router(dashboard_routes.router, prefix="/api/dashboard", tags=["dashboard"])
app.include_router(crop_routes.router, prefix="/api/crops", tags=["crops"])
app.include_router(sensor_routes.router, prefix="/api/sensors", tags=["sensors"])
app.include_router(ai_routes.router, prefix="/api/ai", tags=["ai"])
app.include_router(weather_routes.router, prefix="/api/weather", tags=["weather"])
app.include_router(alerts_routes.router, prefix="/api/alerts", tags=["alerts"])
app.include_router(fields_routes.router, prefix="/api/fields", tags=["fields"])
app.include_router(reports_routes.router, prefix="/api/reports", tags=["reports"])

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "version": "1.0.0"}

@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "Plant Protector API - Agricultural Intelligence Platform"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
```

### 2. `backend/requirements.txt` - Dependencies

```
fastapi==0.104.1
uvicorn[standard]==0.24.0
pydantic==2.5.0
pydantic-settings==2.1.0
python-dotenv==1.0.0
python-multipart==0.0.6
aiohttp==3.9.1
pandas==2.1.1
numpy==1.26.2
scipy==1.11.4
scikit-learn==1.3.2
sqlalchemy==2.0.23
psycopg2-binary==2.9.9
supabase==2.2.1
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-dateutil==2.8.2
requests==2.31.0
websockets==12.0
pytz==2023.3
Pillow==10.1.0
jinja2==3.1.2
reportlab==4.0.7
openpyxl==3.11.0
pytest==7.4.3
pytest-asyncio==0.21.1
```

### 3. `backend/config/settings.py` - Configuration

```python
from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):
    # API Settings
    API_TITLE: str = "Plant Protector API"
    DEBUG: bool = os.getenv("DEBUG", "False") == "True"
    
    # Supabase Configuration
    SUPABASE_URL: str = os.getenv("VITE_SUPABASE_URL", "")
    SUPABASE_KEY: str = os.getenv("VITE_SUPABASE_PUBLISHABLE_KEY", "")
    SUPABASE_SERVICE_ROLE: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://user:password@localhost/agro_lens")
    
    # Weather API (OpenWeatherMap)
    OPENWEATHER_API_KEY: str = os.getenv("OPENWEATHER_API_KEY", "")
    
    # Satellite API (Sentinel Hub)
    SENTINEL_API_KEY: str = os.getenv("SENTINEL_API_KEY", "")
    
    # ML Model Paths
    PEST_MODEL_PATH: str = "models/pest_prediction.pkl"
    YIELD_MODEL_PATH: str = "models/yield_prediction.pkl"
    
    # CORS Settings
    CORS_ORIGINS: list = [
        "http://localhost:3000",
        "http://localhost:5173",
        "https://yourdomain.com",
    ]
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
```

### 4. `backend/models/crop_models.py` - Data Models

```python
from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List

class CropBase(BaseModel):
    name: str
    type: str  # Wheat, Corn, Rice, etc.
    planted_date: datetime
    expected_harvest: datetime

class Crop(CropBase):
    id: str
    field_id: str
    created_at: datetime
    updated_at: datetime

class CropHealth(BaseModel):
    crop_id: str
    ndvi: float  # Normalized Difference Vegetation Index (0-1)
    evi: float   # Enhanced Vegetation Index (0-1)
    chlorophyll: float
    water_stress: float  # 0-100
    timestamp: datetime

class SoilData(BaseModel):
    field_id: str
    moisture: float  # 0-100 %
    ph: float  # 0-14
    nitrogen: float  # ppm
    phosphorus: float  # ppm
    potassium: float  # ppm
    organic_matter: float  # %
    temperature: float  # °C
    ec: float  # Electrical Conductivity
    timestamp: datetime

class FieldBoundary(BaseModel):
    field_id: str
    coordinates: List[List[float]]  # [lat, lng] pairs
    area_hectares: float
    perimeter_km: float
```

### 5. `backend/services/satellite_service.py` - Satellite Data

```python
import numpy as np
from datetime import datetime, timedelta
from typing import List, Dict
import random

class SatelliteService:
    """Service for satellite imagery and vegetation indices"""
    
    @staticmethod
    def calculate_ndvi(field_id: str, days: int = 30) -> List[Dict]:
        """
        Calculate NDVI (Normalized Difference Vegetation Index)
        NDVI = (NIR - Red) / (NIR + Red)
        Range: -1 to +1
        """
        ndvi_data = []
        base_ndvi = 0.65 + random.random() * 0.2
        
        for i in range(days):
            # Add realistic daily variation
            daily_ndvi = base_ndvi + (random.random() - 0.5) * 0.15
            daily_ndvi = max(0, min(1, daily_ndvi))
            
            timestamp = datetime.now() - timedelta(days=days-i-1)
            
            ndvi_data.append({
                "date": timestamp.isoformat(),
                "value": round(daily_ndvi, 3),
                "quality": random.choice(["good", "fair", "poor"]),
                "cloud_cover": round(random.random() * 30)
            })
        
        return ndvi_data
    
    @staticmethod
    def calculate_evi(field_id: str, days: int = 30) -> List[Dict]:
        """
        Calculate EVI (Enhanced Vegetation Index)
        More sensitive to vegetation than NDVI
        Range: -1 to +1
        """
        evi_data = []
        base_evi = 0.50 + random.random() * 0.25
        
        for i in range(days):
            daily_evi = base_evi + (random.random() - 0.5) * 0.12
            daily_evi = max(0, min(1, daily_evi))
            
            timestamp = datetime.now() - timedelta(days=days-i-1)
            
            evi_data.append({
                "date": timestamp.isoformat(),
                "value": round(daily_evi, 3),
            })
        
        return evi_data
    
    @staticmethod
    def get_current_indices(field_id: str) -> Dict:
        """Get current NDVI and EVI values"""
        return {
            "ndvi": round(0.65 + random.random() * 0.25, 3),
            "evi": round(0.50 + random.random() * 0.25, 3),
            "timestamp": datetime.now().isoformat(),
            "last_update": "2 hours ago",
            "satellite": "Sentinel-2"
        }
```

### 6. `backend/services/sensor_service.py` - Sensor Data

```python
import random
from datetime import datetime, timedelta
from typing import List, Dict

class SensorService:
    """Service for sensor data processing and generation"""
    
    @staticmethod
    def get_current_sensor_data(field_id: str) -> Dict:
        """Get current sensor readings"""
        hour = datetime.now().hour
        
        # Realistic daily cycles
        temp_base = 32 if 10 <= hour <= 16 else 24
        humidity_base = 75 if 6 <= hour <= 10 else 55
        
        return {
            "field_id": field_id,
            "soil_moisture": round(35 + random.random() * 30, 1),
            "temperature": round(temp_base + (random.random() * 6 - 3), 1),
            "humidity": round(humidity_base + (random.random() * 20 - 10), 1),
            "soil_ph": round(6.0 + random.random() * 1.0, 2),
            "light_intensity": round(
                (40000 + random.random() * 20000) if 6 <= hour <= 18 else 100 + random.random() * 200
            ),
            "rainfall": round(random.random() * 5, 2),
            "ec": round(1.0 + random.random() * 0.5, 2),  # Electrical Conductivity
            "timestamp": datetime.now().isoformat()
        }
    
    @staticmethod
    def get_sensor_history(field_id: str, days: int = 7) -> List[Dict]:
        """Get historical sensor data"""
        history = []
        
        for i in range(days * 24):  # Hourly data
            timestamp = datetime.now() - timedelta(hours=days*24-i-1)
            hour = timestamp.hour
            
            temp_base = 32 if 10 <= hour <= 16 else 24
            
            history.append({
                "timestamp": timestamp.isoformat(),
                "soil_moisture": round(35 + random.random() * 30, 1),
                "temperature": round(temp_base + (random.random() * 6 - 3), 1),
                "humidity": round((75 if 6 <= hour <= 10 else 55) + (random.random() * 20 - 10), 1),
            })
        
        return history
```

---

## 🔗 API ENDPOINTS TO IMPLEMENT

### Dashboard Endpoints
```
GET    /api/dashboard/summary          # Overall farm status
GET    /api/dashboard/metrics          # Key metrics cards
```

### Crop & Field Endpoints
```
GET    /api/crops                      # List all crops
GET    /api/crops/{crop_id}           # Get crop details
POST   /api/crops                      # Create new crop
PUT    /api/crops/{crop_id}           # Update crop
DELETE /api/crops/{crop_id}           # Delete crop

GET    /api/fields                     # List all fields
GET    /api/fields/{field_id}         # Get field details
POST   /api/fields                     # Create new field
PUT    /api/fields/{field_id}         # Update field
DELETE /api/fields/{field_id}         # Delete field
```

### Sensor Endpoints
```
GET    /api/sensors/current            # Current sensor readings
GET    /api/sensors/{field_id}/history # Historical data
GET    /api/sensors/{field_id}/latest  # Latest readings
```

### Satellite Endpoints
```
GET    /api/satellite/ndvi             # NDVI data
GET    /api/satellite/evi              # EVI data
GET    /api/satellite/indices          # Current vegetation indices
```

### AI Prediction Endpoints
```
POST   /api/ai/pest-prediction         # Pest risk prediction
POST   /api/ai/disease-prediction      # Disease risk prediction
POST   /api/ai/yield-prediction        # Yield estimation
POST   /api/ai/growth-stage            # Growth stage prediction
GET    /api/ai/recommendations         # Get recommendations
```

### Alerts Endpoints
```
GET    /api/alerts/current             # Active alerts
GET    /api/alerts/history             # Alert history
POST   /api/alerts/{id}/resolve        # Mark alert as resolved
POST   /api/alerts/{id}/dismiss        # Dismiss alert
```

### Reports Endpoints
```
POST   /api/reports/generate           # Generate report
GET    /api/reports/{report_id}        # Get report details
GET    /api/reports                    # List reports
DELETE /api/reports/{report_id}        # Delete report
```

### Weather Endpoints
```
GET    /api/weather/current            # Current weather
GET    /api/weather/forecast           # Weather forecast
GET    /api/weather/history            # Historical weather
```

---

## 🔄 DATABASE SCHEMA (Supabase)

### Tables to Create:

```sql
-- Users (handled by Supabase Auth)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name TEXT,
  avatar_url TEXT,
  farm_name TEXT,
  location TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Fields
CREATE TABLE fields (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  name TEXT NOT NULL,
  crop_type TEXT,
  area_hectares FLOAT,
  coordinates JSONB,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Sensors
CREATE TABLE sensors (
  id UUID PRIMARY KEY,
  field_id UUID REFERENCES fields(id),
  name TEXT,
  type TEXT,
  latitude FLOAT,
  longitude FLOAT,
  created_at TIMESTAMP
);

-- Sensor Readings
CREATE TABLE sensor_readings (
  id BIGSERIAL PRIMARY KEY,
  sensor_id UUID REFERENCES sensors(id),
  soil_moisture FLOAT,
  temperature FLOAT,
  humidity FLOAT,
  soil_ph FLOAT,
  light_intensity FLOAT,
  timestamp TIMESTAMP
);

-- Alerts
CREATE TABLE alerts (
  id UUID PRIMARY KEY,
  field_id UUID REFERENCES fields(id),
  title TEXT NOT NULL,
  description TEXT,
  severity TEXT,
  type TEXT,
  is_resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP,
  resolved_at TIMESTAMP
);

-- Predictions
CREATE TABLE predictions (
  id UUID PRIMARY KEY,
  field_id UUID REFERENCES fields(id),
  model_type TEXT,
  input_data JSONB,
  result JSONB,
  confidence FLOAT,
  created_at TIMESTAMP
);

-- Reports
CREATE TABLE reports (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  field_id UUID REFERENCES fields(id),
  report_type TEXT,
  content JSONB,
  format TEXT,
  created_at TIMESTAMP
);
```

---

## 🧪 TESTING

### Sample Test File Structure

```python
# backend/tests/test_api.py
import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_get_fields():
    response = client.get("/api/fields")
    assert response.status_code == 200

def test_get_current_sensor_data():
    response = client.get("/api/sensors/current?field_id=test-field")
    assert response.status_code == 200
    data = response.json()
    assert "soil_moisture" in data
    assert "temperature" in data
```

---

## 📋 DEPLOYMENT CHECKLIST

- [ ] Create Python backend structure
- [ ] Set up FastAPI application
- [ ] Implement all route files
- [ ] Create service layer functions
- [ ] Set up Supabase database schema
- [ ] Implement WebSocket for real-time data
- [ ] Add authentication middleware
- [ ] Create API documentation (Swagger)
- [ ] Write unit and integration tests
- [ ] Set up error handling and logging
- [ ] Optimize database queries with indexes
- [ ] Configure environment variables for production
- [ ] Set up CI/CD pipeline
- [ ] Deploy to production server
- [ ] Monitor API performance
- [ ] Set up error tracking (Sentry)
- [ ] Configure caching strategies

---

## 🚀 QUICK REFERENCE COMMANDS

```bash
# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows

# Install dependencies
pip install -r requirements.txt

# Run development server
uvicorn main:app --reload

# Run with specific port
uvicorn main:app --reload --port 8001

# Access API documentation
# Swagger UI: http://localhost:8000/docs
# ReDoc: http://localhost:8000/redoc

# Run tests
pytest tests/

# Run tests with coverage
pytest tests/ --cov

# Create requirements file from current env
pip freeze > requirements.txt
```

---

**This guide provides the foundation for building the backend. Each service should be implemented with realistic agricultural algorithms and data integration.**

