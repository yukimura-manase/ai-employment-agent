from fastapi import FastAPI

from api.routers.aiChat import router as aiChatRouter  # モジュールではなく、router オブジェクトをインポート

# FastAPIのインスタンス。uvicornを通してこのファイルの app インスタンスが参照する。
app = FastAPI()

@app.get("/")
async def hello():
    return {"message": "Hello FastAPI!"}

# aiChatRouter(= APIRouterのインスタンス)を include_router に渡す。
app.include_router(aiChatRouter)


