from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routers.aiChat import router as aiChatRouter  # モジュールではなく、router オブジェクトをインポート
from api.routers.job_search import router as jobSearchRouter
from api.routers.entrysheet import router as entrysheetRouter


# FastAPIのインスタンス。uvicornを通してこのファイルの app インスタンスが参照する。
app = FastAPI()

# CORSミドルウェアを追加
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 本番環境では適切なオリジンを指定してください
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def hello():
    return {"message": "Hello FastAPI!"}

# APIRouterのインスタンスを include_router に渡す。
app.include_router(aiChatRouter)
app.include_router(jobSearchRouter)
app.include_router(entrysheetRouter)

