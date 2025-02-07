import os
from supabase import create_client, Client
from models.message import MessageSummary
from models.entrysheet import EntrySheet
import uuid

supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_ANON_KEY")

supabase: Client = create_client(supabase_url, supabase_key)


def save_entrysheet_items(user_id: str, entrysheet_items: dict):
    """
    EntrySheetAgentが出力したエントリーシート項目を保存する
    """

    # MessageSummariesに保存
    try:
        # entrysheet_itemsはdictだが、保存先のcontentがstrなので変換している
        message_summary_id = uuid.uuid4()
        insert_data = MessageSummary(
            message_summary_id=message_summary_id,
            user_id=user_id,
            category="ENTRYSHEET",
            content=str(entrysheet_items),
        )
        response = (
            supabase.table("MessageSummaries")
            .insert(insert_data.model_dump())
            .execute()
        )
    except Exception as e:
        raise Exception(f"Failed to save message summary: {str(e)}")

    # EntrySheetsにmessage_summary_idで紐づけて保存
    try:
        insert_data = EntrySheet(
            entrysheet_id=uuid.uuid4(),
            user_id=user_id,
            correlation_count=1,
            message_summary_id=message_summary_id,
        )
        response = (
            supabase.table("EntrySheets")
            .insert(insert_data.model_dump())
            .execute()
        )
    except Exception as e:
        raise Exception(f"Failed to save entrysheet: {str(e)}")

    return {"status": "success"}


def save_search_result(user_id: str, search_result_items: list[dict]):
    """
    JobSearchAgentが出力した求人検索結果を保存する
    """
    try:
        insert_data = MessageSummary(
            message_summary_id=uuid.uuid4(),
            user_id=user_id,
            category="RECRUIT",
            content=str(search_result_items),
        )
        response = (
            supabase.table("MessageSummaries")
            .insert(insert_data)
            .execute()
        )
    except Exception as e:
        raise Exception(f"Failed to save search results: {str(e)}")

    return {"status": "success"}
