import os
from fastapi import APIRouter, HTTPException, BackgroundTasks
from models.job_search import JobSearchRequest, JobSearchResponse
from api.services.job_search import SimpleLangChainAgent, JobSearchAgent
from typing import List
from api.services import db_service

router = APIRouter(prefix="/job-search", tags=["job-search"])

# 仮のJobSearchAgentを実行
@router.post("/search")
@router.post("/search")
async def job_search(
    request: JobSearchRequest,
    background_tasks: BackgroundTasks
) -> JobSearchResponse:
    try:
        search_result_items = JobSearchAgent(request).execute()

        # バックグラウンドでDB保存処理を実行
        background_tasks.add_task(db_service.save_search_result, request.user_id, search_result_items)

        response = JobSearchResponse(items=search_result_items)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")
