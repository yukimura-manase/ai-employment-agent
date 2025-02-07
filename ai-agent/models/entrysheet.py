from pydantic import field_validator
from models.base import BaseSchema
from typing import Dict


# EntrySheetsテーブルに対応したモデルクラス
class EntrySheet(BaseSchema):
    entrysheet_id: str
    user_id: str
    correlation_count: int
    message_summary_id: str


system_prompt = """
あなたはプロの就職エージェントです。
顧客の情報が入力されるので、その情報に基づいて
エントリーシートを作成してください。

エントリーシートに必要な項目は
Structured Outputとして指定しています。
これら項目の文章をOutputとして出力してください。
"""

need_properties = {
    "自己PR": {"type": "STRING"},
    "技術的な経験" : {"type" : "STRING"}
}


class EntrySheetRequest(BaseSchema):
    user_id: str
    user_information: str
    system_prompt: str = system_prompt
    need_properties: Dict[str, dict] = need_properties

    @field_validator("need_properties", mode="before")
    @classmethod
    def validate_need_properties(cls, v: dict) -> dict:
        if not isinstance(v, dict):
            raise ValueError("need_properties must be a dict")
        for key, inner in v.items():
            if not isinstance(inner, dict):
                raise ValueError(f"Value for key '{key}' must be a dict")
            # 内包する辞書が "type" キーのみを含むことをチェック
            if set(inner.keys()) != {"type"}:
                raise ValueError(
                    f"Inner dict for key '{key}' must contain only the 'type' key."
                )
        return v


class EntrySheetResponse(BaseSchema):
    user_id: str
    text: str  # Markdown text
