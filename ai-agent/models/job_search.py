from models.base import BaseSchema
from datetime import datetime
from typing import List

# 求人検索APIの入力クラス
class JobSearchRequest(BaseSchema):
    user_id: str
    system_prompt: str
    need_properties: dict
    user_information: str

# 求人情報のクラス
class JobOffer(BaseSchema):
    id: int
    title: str
    description: str
    company: str
    location: str
    salary: int
    tags: List[str]

# 求人検索のレスポンスクラス
class JobSearchResponse(BaseSchema):
    user_id: str
    text: str  # markdown text