import os
from fastapi import APIRouter, HTTPException
from supabase import create_client, Client
from models.user import UserProfile
from api.services.search_offers import search_personalized_offers

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("SUPABASE_URLとSUPABASE_KEYを設定してください")

# supabaseクライアント
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

router = APIRouter(
    prefix="/search-offers",
    tags=["search-offers"]
)

@router.post("/generate-sheet")
async def create_information_sheet(profile: UserProfile):
    """
    フロントエンドから送られてきたユーザー経歴情報をもとに求人検索をするエンドポイント
    """
    try:
        response = search_personalized_offers(profile)
        return {"status": "success", "response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sheet generation failed: {str(e)}")


# supabaseを扱うエンドポイントの例
@router.get("/items")
def get_items():
    """
    Supabase の items テーブルから全件データを取得して返すエンドポイント
    """
    try:
        # items テーブルから全てのカラムを選択
        response = supabase.table("items").select("*").execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
