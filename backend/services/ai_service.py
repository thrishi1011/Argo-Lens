from typing import Dict, Any, List

class AIService:
    async def predict_pest_risk(self, crop_type: str, ndvi: float, temperature: float, humidity: float, soil_moisture: float) -> Dict[str, Any]:
        return {
            "risk_level": "low",
            "risk_score": 0.24,
            "threats": ["aphids", "fungal_disease"],
            "confidence": 0.85,
            "last_outbreak": "2024-01-15",
            "preventive_measures": ["Monitor leaves", "Ensure proper drainage"]
        }
