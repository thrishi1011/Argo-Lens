from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from backend.routes import field_routes
# from routes import crop_routes, sensor_routes, ai_routes, weather_routes, dashboard_routes

app = FastAPI(title="Plant Protector API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(field_routes.router)
# app.include_router(crop_routes.router)
# app.include_router(sensor_routes.router)
# app.include_router(ai_routes.router)
# app.include_router(weather_routes.router)
# app.include_router(dashboard_routes.router)

@app.get("/")
async def root():
    return {"message": "Plant Protector API", "status": "operational"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}
