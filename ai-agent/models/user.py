# user関連テーブルの型定義を記述する。

from typing import List, Optional
from pydantic import BaseModel, EmailStr


# 以下は例
class WorkExperience(BaseModel):
    company: str
    position: str
    start_date: str  # 実際は datetime 型などにするのもあり
    end_date: Optional[str]  # 現在も勤務中の場合は None になる可能性あり

class UserProfile(BaseModel):
    id: int
    name: str
    email: EmailStr
    bio: Optional[str]
    experiences: List[WorkExperience]
    skills: List[str]
