from fastapi import APIRouter, WebSocket
from google import genai

import os
from dotenv import load_dotenv
import json
import asyncio

load_dotenv()  # .envファイルから環境変数を読み込む

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

# FastAPI の Router Instance 
router = APIRouter()

# WebSocket接続のためのエンドポイント
@router.websocket("/ws/ai-chat")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    
    try:
        # Gemini APIクライアントの初期化
        client = genai.Client(api_key=GEMINI_API_KEY)
        
        # AIのペルソナ設定
        system_prompt = """
        あなたは就活生のキャリアアドバイザーです。
        以下の特徴を持っています：
        - 親身になって相談に乗る
        - 具体的なアドバイスを提供する
        - 就活生の不安や悩みに共感する
        - 業界知識が豊富
        
        短く簡潔な応答を心がけてください。
        """

        # Live APIセッションの開始
        async with client.aio.live.connect(
            model="gemini-2.0-flash-exp",
            config={"response_modalities": ["TEXT", "SPEECH"]}
        ) as session:
            # システムプロンプトを送信
            await session.send(system_prompt)
            
            while True:
                # クライアントからのメッセージを待機
                message = await websocket.receive_text()
                data = json.loads(message)
                
                if data["type"] == "end":
                    break
                
                # ユーザーメッセージをGeminiに送信
                await session.send(data["message"], end_of_turn=True)
                
                # Geminiからの応答を受信して送信
                async for response in session.receive():
                    if response.text:
                        await websocket.send_json({
                            "type": "text",
                            "content": response.text
                        })
                    if response.speech:
                        await websocket.send_json({
                            "type": "speech",
                            "content": response.speech
                        })
                
    except Exception as e:
        print(f"Error: {e}")
        await websocket.close()

# 既存のRESTエンドポイントは残しておく
@router.get("/ai-chat")
async def hello():
    return {"message": "Hello AI Chat!"}

@router.post("/ai-chat")
async def chat(input_data: dict):
    client = genai.Client(api_key=GEMINI_API_KEY, http_options={'api_version': 'v1alpha'})
    
    # AIのペルソナ設定
    system_prompt = """
    あなたは就活生のキャリアアドバイザーです。
    以下の特徴を持っています：
    - 親身になって相談に乗る
    - 具体的なアドバイスを提供する
    - 就活生の不安や悩みに共感する
    - 業界知識が豊富
    
    短く簡潔な応答を心がけてください。
    """
    
    # 会話履歴とシステムプロンプトを含めて生成
    response = await client.models.generate_content(
        model='gemini-2.0-flash-exp',
        contents=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": input_data['message']}
        ]
    )
    
    return {"text": response.text}