# user関連テーブルの型定義を記述する。

from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, EmailStr
from datetime import datetime

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
    experiences: List[WorkExperience]
    skills: List[str]

# supabase tables
class User(BaseModel):
    id: int
    name: str
    email: EmailStr
    created_at: datetime = datetime.now()
    updated_at: datetime = datetime.now()


class WorkStyle(str, Enum):
    REMOTE = 'REMOTE'
    HYBRID = 'HYBRID'
    ONSITE = 'ONSITE'
    FREELANCE = 'FREELANCE'


class UserWorkProfile(BaseModel):
    id: int
    user_id: int
    last_education: str
    created_at: datetime = datetime.now()
    updated_at: datetime


class UserCareerHistory(BaseModel):
    id: int
    user_id: int
    user_work_profile_id: int
    company: str
    role: str
    start_date: datetime
    end_date: Optional[datetime]
    description: Optional[str]
    created_at: datetime = datetime.now()
    updated_at: datetime


class UserSkill(BaseModel):
    id: int
    user_id: int
    user_work_profile_id: int
    skill_name: str
    created_at: datetime = datetime.now()
    updated_at: datetime


class UserCurrentWork(BaseModel):
    id: int
    user_id: int
    user_work_profile_id: int
    current_industry: str
    current_job_type: str
    current_salary: int
    current_company: str
    current_role: str
    current_work_style: WorkStyle
    created_at: datetime = datetime.now()
    updated_at: datetime


class UserTargetWork(BaseModel):
    id: int
    user_id: int
    user_work_profile_id: int
    target_industry: str
    target_job_type: str
    target_job_content: str
    target_salary: int
    target_work_style: WorkStyle
    target_company: str
    target_role: str
    target_other_conditions: str
    created_at: datetime = datetime.now()
    updated_at: datetime
