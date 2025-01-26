from fastapi import APIRouter
from google import genai

import os
from dotenv import load_dotenv

load_dotenv()  # .envファイルから環境変数を読み込む

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

# FastAPI の Router Instance 
router = APIRouter()


@router.get("/ai-chat")
async def hello():
    return {"message": "Hello AI Chat!"}


# AI Chat API
@router.post("/ai-chat")
async def chat(input_data: dict):
    client = genai.Client(api_key=GEMINI_API_KEY, http_options={'api_version': 'v1alpha'})

    model_id = "gemini-2.0-flash-exp"
    config = {"response_modalities": ["TEXT"]}

    response = await client.models.generate_content(
        model='gemini-2.0-flash-exp',
        contents=input_data['message']
    )
    return {"response": response.text}