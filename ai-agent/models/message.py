# 求人, エントリーシート項目, その他の対話のサマライズデータを格納するための型

from enum import Enum
from models.base import BaseSchema
from datetime import datetime

class Category(Enum):
    RECRUIT = 'RECRUIT'
    ENTRYSHEET = 'ENTRYSHEET'
    GENERAL = 'GENERAL'


class MessageSummary(BaseSchema):
    message_summary_id: str
    user_id: str
    category: Category
    content: str
    created_at: datetime = datetime.now()
