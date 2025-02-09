import logging
from fastapi import APIRouter, HTTPException, BackgroundTasks

from api.services import markdown, job_search
from models.job_search import JobSearchRequest, JobSearchResponse

router = APIRouter(prefix="/job-search", tags=["job-search"])

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)


@router.post("/search")
async def execute_job_search(
    request: JobSearchRequest,
    background_tasks: BackgroundTasks
) -> JobSearchResponse:
    logger.info(request)
    if not request.user_information:
        raise HTTPException(status_code=500, detail="Empty userInformation")
    try:
        response = job_search.predict(request.user_information)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")

    try:
        """target_columns = [
            "会社",
            "担当業務",
            "求人概要",
            "求人説明",
            "求人リンク"
        ]
        response_data = pd.DataFrame(response)[target_columns]
        """
        # 検索結果jsonをmarkdown化
        markdown_text: str = markdown.write_job_search_result(response)

        """# バックグラウンドでDB保存処理を実行
        background_tasks.add_task(
            db_service.save_search_result,
            request.user_id,
            markdown_text
        )
        """
        response = JobSearchResponse(
            user_id=request.user_id,
            text=markdown_text
        )
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process the result: {str(e)}")
