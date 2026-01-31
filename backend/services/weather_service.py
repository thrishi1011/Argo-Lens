from typing import Dict, Any

class WeatherService:
    async def get_weather(self, lat: float, lng: float) -> Dict[str, Any]:
        return {
            "current_temp": 24.5,
            "current_humidity": 68,
            "conditions": "Partly Cloudy",
            "forecast_24h": "Clear skies",
            "rain_probability": 30,
            "wind_direction": "NW",
            "sunrise": "06:15",
            "sunset": "19:45"
        }
