from pydantic import field_validator
from models.base import BaseSchema
from typing import Dict


# EntrySheetsテーブルに対応したモデルクラス
class EntrySheet(BaseSchema):
    entrysheet_id: str
    user_id: str
    correlation_count: int
    message_summary_id: str


class EntrySheetRequest(BaseSchema):
    user_id: str
    system_prompt: str
    need_properties: Dict[str, dict]
    user_information: str

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
    items: Dict[str, str]  # {"自己PR": "私は○○です", "技術的な経験": "○○の経験があります"}




'''

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

user_information = """
## ユーザーの現在の職業
公務員

## ユーザーのなりたい職業
データサイエンティスト

## ユーザーのこれまでの経験
ユーザーは技術習得の機械学習コンペティションに多く参加してきました。
データ活用に課題を抱えている分野や企業のデータに対して最大限データを
活用できるようになりたいという原動力からの参加でした。
初期はコンペティションで多く使われている手法や最新手法
ばかりを試し、思うように成績が上げられない問題がありました。
しかし、毎回のコンペティションで扱うデータのドメイン知識の調査や
分析を徹底的に行い、チームでコンペティションに参加する際は、
チームが効率的にPDCAサイクルを行える実験環境の構築やマネジメントに
徹することでコンペティションサイトNishikaであるコンペにおいて1位を達成しました。

充電率予測の既存研究で使われているLSTMやCNNの様な最新手法では精度が上がらない
問題があった。その問題に対し、データの可視化やスパースモデリングと呼ばれる手法を用いて
真に重要な特徴を抽出し、この特徴のみを使ったモデルを作成することで、
既存研究より高い精度を出すことに成功した。

## エントリーシートの対象となる求人募集
【仕事内容】

・自然言語、画像などの非構造化データを処理するシステムの企画／設計／開発／導入

・顧客データやトランザクションデータなどの構造化データを処理するシステムの企画／設計／開発／導入

・エッジデバイスを活用した画像解析基盤開発、およびAIモデル開発、アプリケーション設計／開発／導入／運用

【具体的な業務】

AI&データサイエンス統括部では、以下のような業務を横断的に担っており、
ご経験に応じて、以下のうち一部を担当します。

・AI開発：自然言語や画像解析に関連するAIモデルの開発や、エッジデバイスにおける
画像解析や周辺システムの開発業務を行います。顧客ニーズの深掘りや
作業平易化を考慮したシステム開発も担当します。
"""

'''