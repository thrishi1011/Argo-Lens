from typing import Dict, Any, Optional, List

class SensorService:
    async def get_field_sensors(self, field_id: str) -> Optional[Dict[str, Any]]:
        # Mock data
        return {
            "soil_moisture": 65.2,
            "temperature": 24.5,
            "humidity": 68.0,
            "soil_ph": 6.8,
            "light_intensity": 1250,
            "wind_speed": 12.3,
            "rainfall": 5.2,
            "nitrogen": 45,
            "phosphorus": 32,
            "potassium": 28
        }

    async def get_nearest_sensors(self, field_id: str) -> Dict[str, Any]:
        return {
            "soil_moisture": 60.0,
            "temperature": 25.0,
            "humidity": 65.0,
            "soil_ph": 7.0,
            "light_intensity": 1200,
            "wind_speed": 10.0,
            "rainfall": 0.0,
            "nitrogen": 40,
            "phosphorus": 30,
            "potassium": 25
        }
    
    async def get_moisture_history(self, field_id: str, days: int) -> List[float]:
        return [60.0, 62.0, 65.0, 68.0, 70.0, 65.0, 60.0, 55.0, 50.0, 45.0]
