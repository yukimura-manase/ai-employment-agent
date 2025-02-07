import os
from fastapi import APIRouter, HTTPException, BackgroundTasks
from models.job_search import JobSearchInput, JobSearchResponse
from api.services.job_search import SimpleLangChainAgent, JobSearchAgent
from typing import List
from api.services import db_service

router = APIRouter(prefix="/job-search", tags=["job-search"])

# JobSearchAgentを実行
@router.post("/search")
async def job_search(
    search_input: JobSearchInput,
    background_tasks: BackgroundTasks
) -> List[dict]:
    try:
        search_result_items = JobSearchAgent(search_input).execute()

        # バックグラウンドでDB保存処理を実行
        background_tasks.add_task(db_service.save_entrysheet_items, search_result_items)

        response = JobSearchResponse(items=search_result_items)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")
