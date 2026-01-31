from fastapi import APIRouter, HTTPException
from backend.models.field_models import FieldAnalysisResponse
from backend.services.field_analysis_service import FieldAnalysisService

router = APIRouter(prefix="/api/fields", tags=["fields"])
analysis_service = FieldAnalysisService()

@router.get("/{field_id}/detailed-analysis", response_model=FieldAnalysisResponse)
async def get_field_detailed_analysis(field_id: str):
    """
    Get comprehensive analysis for a specific field
    Returns: All metrics, predictions, recommendations for the field
    """
    try:
        # Validate field exists
        if not await analysis_service.field_exists(field_id):
            raise HTTPException(status_code=404, detail="Field not found")
        
        # Get all analysis data in parallel for performance
        analysis_data = await analysis_service.get_comprehensive_analysis(field_id)
        
        return analysis_data
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")
