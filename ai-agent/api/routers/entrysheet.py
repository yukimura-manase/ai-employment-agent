from fastapi import HTTPException, APIRouter
from api.services.entrysheet import EntrySheetAgent
from models.entrysheet import EntrySheetInput, EntrySheetResponse

router = APIRouter(prefix="/entrysheet", tags=["entrysheet"])


@router.post("/generate")
async def generate_entrysheet_items(request: EntrySheetInput) -> EntrySheetResponse:
    """
    input:
        system_prompt: agentのベースのprompt
        need_properties: agentに出力を期待する項目とその形式
        user_information: ユーザーに関してわかっている情報や会話履歴のprompt

    output:
        entrysheet_items: 出力を期待した項目とその内容のdict
    """
    try:
        entrysheet_agent = EntrySheetAgent(request.system_prompt)
        entrysheet_items = entrysheet_agent.generate(
            need_properties=request.need_properties,
            user_information=request.user_information
        )
        print(entrysheet_items)

        response = EntrySheetResponse(items=entrysheet_items)
        return response

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
