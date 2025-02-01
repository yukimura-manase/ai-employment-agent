from fastapi import APIRouter, WebSocket
from google import genai

import os
from dotenv import load_dotenv
import json
import asyncio
import websockets

load_dotenv()  # .envファイルから環境変数を読み込む

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

# FastAPI の Router Instance 
router = APIRouter(
    prefix="/ai-chat",  # プレフィックスを追加
    tags=["ai-chat"]    # Swagger用のタグ
)

# WebSocket接続のためのエンドポイントのパスを修正
@router.websocket("/ws")  # /ai-chat/ws になる
async def websocket_endpoint(websocket: WebSocket):
    try:
        print("GEMINI_API_KEY", GEMINI_API_KEY)

        # WebSocket接続を受け入れる。
        await websocket.accept()
        print("WebSocket connection accepted")
        
        # Gemini APIクライアントの初期化
        client = genai.Client(api_key=GEMINI_API_KEY, http_options={'api_version': 'v1alpha'})
        model_id = "gemini-2.0-flash-exp"
        config = {
            # "response_modalities": ["TEXT", "AUDIO"],  # テキストと音声の両方を返す。
            "response_modalities": ["AUDIO"],  # 音声のみを返す。
            "speech": {
                "model": "gemini-2.0-flash-exp",
                "language": "ja-JP"
            }
        }
        print("Gemini APIクライアントの初期化")
        print("client", client)
        
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

        # GeminiのLive APIセッションを開始
        async with client.aio.live.connect(
            model=model_id,
            config=config,
        ) as session:
            print("GeminiのLive APIセッションを開始")
            
            # システムプロンプトを送信
            # await session.send(system_prompt)
            
            while True:
                try:
                    # クライアントからのメッセージを待機
                    message = await websocket.receive_text()
                    print("message", message)
                    data = json.loads(message)
                    print("data", data)

                    if data["type"] == "end":
                        await websocket.close(1000)
                        break
                    
                    # ユーザーメッセージをGeminiに送信
                    await session.send(data["message"], end_of_turn=True)
                    
                    # Geminiからの応答を受信して送信
                    text_response = None
                    speech_response = None

                    async for response in session.receive():
                        if response.text:
                            text_response = response.text
                        if response.speech:
                            speech_response = response.speech

                    print("text_response", text_response)
                    print("speech_response", speech_response)

                    # テキストと音声の両方を送信
                    if text_response:
                        await websocket.send_json({
                            "type": "text",
                            "content": text_response
                        })
                    if speech_response:
                        await websocket.send_json({
                            "type": "speech",
                            "content": speech_response
                        })

                except websockets.exceptions.ConnectionClosedError:
                    print("WebSocket connection closed by client")
                    break
                except Exception as e:
                    print(f"Error in message handling: {e}")
                    if websocket.client_state.value == 1:  # still connected
                        await websocket.send_json({
                            "type": "error",
                            "content": f"Message handling error: {str(e)}"
                        })
                    break
            
    except Exception as e:
        print(f"WebSocket connection error: {e}")
        # エラーメッセージを送信してからクローズ
        try:
            if websocket.client_state.value == 1:
                await websocket.send_json({
                    "type": "error",
                    "content": f"Connection error: {str(e)}"
                })
                await websocket.close(1011)
        except:
            pass  # 接続が既に閉じられている場合は無視

# 既存のRESTエンドポイントのパスも修正
@router.get("")  # /ai-chat になる
async def hello():
    return {"message": "Hello AI Chat!"}

@router.post("")  # /ai-chat になる
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