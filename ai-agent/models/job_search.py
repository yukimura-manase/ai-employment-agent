from models.base import BaseSchema


# 求人検索APIの入力クラス
class JobSearchRequest(BaseSchema):
    user_id: str
    user_information: str


# 求人検索のレスポンスクラス
class JobSearchResponse(BaseSchema):
    user_id: str
    text: str  # markdown text
