from fastapi import HTTPException, APIRouter
from models.user import UserProfile
from api.services.sheet_generator import generate_information_sheet

router = APIRouter(prefix="/sheet-generator", tags=["sheet-generator"])

@router.post("/generate-sheet")
async def create_information_sheet(profile: UserProfile):
    """
    フロントエンドから送られてきたユーザー経歴情報をもとに情報シートを生成するAPIエンドポイント
    """
    try:
        sheet = generate_information_sheet(profile)
        return {"status": "success", "sheet": sheet}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sheet generation failed: {str(e)}")
