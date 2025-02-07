import os
from supabase import create_client, Client
from models.message import MessageSummary
from models.entrysheet import EntrySheet
import uuid

supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_ANON_KEY")

supabase: Client = create_client(supabase_url, supabase_key)


def save_message_summary(user_id: str, markdown_text: str) -> uuid.UUID:
    """
    MessageSummariesに保存
    """
    try:
        message_summary_id = uuid.uuid4()
        insert_data = MessageSummary(
            message_summary_id=message_summary_id,
            user_id=user_id,
            category="ENTRYSHEET",
            content=markdown_text,
        )
        response = (
            supabase.table("MessageSummaries")
            .insert(insert_data.model_dump())
            .execute()
        )
        return message_summary_id
    except Exception as e:
        raise Exception(f"Failed to save message summary: {str(e)}")


def save_entrysheet(user_id: str, message_summary_id: uuid.UUID):
    """
    EntrySheetsに保存
    """
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


def save_entrysheet_items(user_id: str, markdown_text: str):
    """
    EntrySheetAgentが出力したエントリーシート項目を保存する。
    """
    message_summary_id = save_message_summary(user_id, markdown_text)
    save_entrysheet(user_id, message_summary_id)


def save_search_result(user_id: str, markdown_text: str):
    """
    JobSearchAgentが出力した求人検索結果を保存する。
    """
    try:
        insert_data = MessageSummary(
            message_summary_id=uuid.uuid4(),
            user_id=user_id,
            category="RECRUIT",
            content=markdown_text,
        )
        response = (
            supabase.table("MessageSummaries")
            .insert(insert_data)
            .execute()
        )
    except Exception as e:
        raise Exception(f"Failed to save search results: {str(e)}")
