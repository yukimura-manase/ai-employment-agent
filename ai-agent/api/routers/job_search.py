from fastapi import APIRouter, HTTPException, BackgroundTasks
from api.services.job_search import JobSearchAgent
from api.services import db_service, markdown

from models.job_search import JobSearchRequest, JobSearchResponse
from api.services import markdown

router = APIRouter(prefix="/job-search", tags=["job-search"])

# 仮のJobSearchAgentを実行
@router.post("/search")
async def job_search(
    request: JobSearchRequest,
    background_tasks: BackgroundTasks
) -> JobSearchResponse:
    try:
        job_items = JobSearchAgent(request).execute()

        # 検索結果jsonをmarkdown化
        markdown_text: str = markdown.write_job_search_result(job_items)

        # バックグラウンドでDB保存処理を実行
        background_tasks.add_task(
            db_service.save_search_result,
            request.user_id,
            markdown_text
        )

        response = JobSearchResponse(
            user_id=request.user_id,
            text=markdown_text
        )
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")
