from typing import List

class SatelliteService:
    async def get_ndvi_history(self, field_id: str, days: int) -> List[float]:
        # Mock data
        return [0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.72, 0.71, 0.7]

    async def get_evi_history(self, field_id: str, days: int) -> List[float]:
        # Mock data
        return [0.2, 0.22, 0.25, 0.28, 0.3, 0.32, 0.35, 0.36, 0.35, 0.34]
