from typing import List, Dict, Any
from datetime import datetime

class AlertService:
    async def get_field_alerts(self, field_id: str) -> List[Dict[str, Any]]:
        return [{
            "id": "alert_001",
            "title": "High Soil Moisture",
            "description": "Soil moisture levels are above optimal range.",
            "severity": "medium",
            "status": "active",
            "created_at": datetime.utcnow()
        }]
