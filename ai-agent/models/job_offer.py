from pydantic import BaseModel
from datetime import datetime
from typing import List


# 求人情報のモデルクラス
# job-searcherのレスポンスを受け取り、FEで表示される想定
# 中身は適宜変更
class JobOffer(BaseModel):
    id: int
    title: str
    description: str
    company: str
    location: str
    salary: int
    tags: List[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True