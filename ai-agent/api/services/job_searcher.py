import logging
import os
from googleapiclient.discovery import build
from models.user import UserProfile

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

CUSTOM_SEARCH_API_KEY = os.environ.get("CUSTOM_SEARCH_API_KEY")
CUSTOM_SEARCH_ENGINE_ID = os.environ.get("CUSTOM_SEARCH_ENGINE_ID")

# mock
# 求人ではなくかんたんな検索結果を返す。
def get_search_response(keyword):
    """
    Google Custom Search APIを使って検索結果を取得する
    """
    service = build("customsearch", "v1", developerKey=CUSTOM_SEARCH_API_KEY)

    try:
        response = service.cse().list(
            q=keyword,
            cx=CUSTOM_SEARCH_ENGINE_ID,
            lr='lang_ja',
            num=10,
            start=1
        ).execute()
        # print(response["items"][0]["link"])
    except Exception as e:
        logger.error(f"Google Custom Search API Error: {e}")
        raise Exception(f"Google Custom Search API Error: {e}")

    return response

def search_personalized_offers(profile: UserProfile):
    """
    ユーザーの経歴情報から求人を検索し、一覧にして返す
    """
    keyword = " ".join(profile.skills)
    logger.info("検索キーワード: " + keyword)
    response = get_search_response(keyword)
    return response
