import os
from fastapi import APIRouter, HTTPException
from supabase import create_client, Client
from models.user import UserProfile
from api.services.job_searcher import search_personalized_offers
from typing import List
from models.job_offer import JobOffer

SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("SUPABASE_URLとSUPABASE_KEYを設定してください")

# supabaseクライアント
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

router = APIRouter(
    prefix="/job-searcher",
    tags=["job-searcher"]
)


@router.post("/search")
async def create_information_sheet(profile: UserProfile):
    """
    FE から送られてきたユーザー経歴をもとに求人検索をするエンドポイント
    """
    try:
        response = search_personalized_offers(profile)
        if response:
            return {"status": "success", "response": response}
        else:
            raise HTTPException(status_code=404, detail="No offers found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")

# mock
@router.post("/save-search-results")
async def save_search_results(results: List[JobOffer]):
    """
    検索結果を保存するエンドポイント
    """
    try:
        response = supabase.table("search_results").insert([result.dict() for result in results]).execute()
        return {"status": "success", "data": response.data}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save search results: {str(e)}")


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
