

import os
import base64

import vertexai
from vertexai import generative_models
from vertexai.generative_models import GenerativeModel, Part, SafetySetting, GenerationConfig

class EntrySheetAgent():
    def __init__(self, system_prompt):
        # init vertexai and agent parameter
        self.init_vertexai()
        self.init_model(system_prompt)
        self.init_fixed_config()

    def generate(self, need_properties, user_information):
        """
        input
        ---
        - need_properties
          agentに出力を期待する項目とその形式
          ``` example
          {"property_info_csv": {"type": "STRING"}}
          ```
        - user_information
          ユーザーに関してわかっている情報や会話履歴を
          promptとしてまとめて入力
          ``` example
          ## 現在の職業
          公務員
          ## 興味のある業界
          Webエンジニア
          ## 印象的なエピソード
          ハッカソンに挑んで優勝
          ```
        """
        # create variable ai parameter
        response_schema = {
            "type": "ARRAY",
            "items": {
                "type": "OBJECT",
                "properties": need_properties,
                "required": list(need_properties.keys()),
            },
        }
        generation_config = GenerationConfig(
            response_mime_type="application/json",
            response_schema=response_schema
        )
        # generate
        response = self.model.generate_content(
            [user_information],
            generation_config=generation_config,
            safety_settings=self.safety_settings,
        )
        entrysheet_items = eval(response.candidates[0].content.parts[0].text)
        return entrysheet_items

    def create_entrysheet_md(self, entrysheet_items):
        md_text = ""
        for entrysheet_item in entrysheet_items:
            md_text += f"## {list(entrysheet_item.keys())[0]} \n"
            md_text += f"{list(entrysheet_item.values())[0]} \n"
        return md_text

    def init_vertexai(self):
        vertexai.init(
            project=os.environ["VERTEXAI_PROJECT_ID"],
            location="us-central1",
        )

    def init_model(self, system_prompt):
        self.model = GenerativeModel(
            "gemini-1.5-pro-002",
            system_instruction=system_prompt
        )

    def init_fixed_config(self):
        self.safety_settings = [
            SafetySetting(
                category=SafetySetting.HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                threshold=SafetySetting.HarmBlockThreshold.OFF
            ),
            SafetySetting(
                category=SafetySetting.HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
                threshold=SafetySetting.HarmBlockThreshold.OFF
            ),
            SafetySetting(
                category=SafetySetting.HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
                threshold=SafetySetting.HarmBlockThreshold.OFF
            ),
            SafetySetting(
                category=SafetySetting.HarmCategory.HARM_CATEGORY_HARASSMENT,
                threshold=SafetySetting.HarmBlockThreshold.OFF
            ),
        ]
