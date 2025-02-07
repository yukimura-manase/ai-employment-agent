from fastapi import HTTPException, APIRouter, BackgroundTasks
from api.services.entrysheet import EntrySheetAgent
from api.services import db_service
from models.entrysheet import EntrySheetRequest, EntrySheetResponse
from api.services.markdown import write_entrysheet

router = APIRouter(prefix="/entrysheet", tags=["entrysheet"])


@router.post("/generate")
async def generate_entrysheet_items(
    request: EntrySheetRequest,
    background_tasks: BackgroundTasks,
) -> EntrySheetResponse:
    try:
        # EntrySheetAgentにリクエスト
        entrysheet_agent = EntrySheetAgent(request.system_prompt)
        entrysheet_items = entrysheet_agent.generate(
            need_properties=request.need_properties,
            user_information=request.user_information
        )
        # print(entrysheet_items)

        # レスポンスのjsonをmarkdown化
        markdown_text: str = write_entrysheet(entrysheet_items)

        # バックグラウンドでDB保存処理を実行
        background_tasks.add_task(
            db_service.save_entrysheet_items,
            request.user_id,
            markdown_text
        )

        response = EntrySheetResponse(
            user_id=request.user_id,
            text=markdown_text
        )
        return response

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
