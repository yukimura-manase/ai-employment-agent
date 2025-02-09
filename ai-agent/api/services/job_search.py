import os
import base64

import vertexai
from vertexai import generative_models
from vertexai.generative_models import GenerativeModel, Part, SafetySetting, GenerationConfig, Tool
from vertexai.preview.generative_models import grounding


class VertexAIBaseAgent():

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
          {
            'comapny_name' : {'type': 'STRING'},
            'job_role' : {'type': 'STRING'}
          }
          ```
        - user_information
          agentに踏まえさせたい情報
          ``` example
          (応募者情報)
          ## 現在の職業
          公務員

          ## 興味のある業界
          Webエンジニア

          (応募企業情報)
          ## 入りたい企業のイメージ
          Webエンジニアながらaiについても触れることが
          できるような企業
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
            system_instruction=system_prompt,
            tools = [
                Tool.from_google_search_retrieval(
                    google_search_retrieval=grounding.GoogleSearchRetrieval()
                ),
            ]
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

company_search_config = {
    "system_prompt" : """
あなたはプロの就職エージェントです。
顧客の情報が入力されるので、その情報に基づいて適している
と思われる1)会社, 2)担当業務を提案してください。

1)会社、2)担当業務については、
Structured Outputとして出力してください。
""",
    "need_properties" :{
        "会社": {"type": "STRING"},
        "担当業務" : {"type" : "STRING"}
  }
}

recruit_search_config = {
    "system_prompt" : """
あなたはプロの就職エージェントです。
顧客が望む 会社 と 担当業務 が入力されるので、
該当する1)求人タイトル、2)求人説明, 3)求人リンクを取得してください。

1)求人タイトル : 求人タイトル
2)求人説明 : 該当求人の説明
3)求人リンク : 求人ページのリンク

1)求人タイトル、2)求人説明、3)求人リンクについては、
Structured Outputとして出力してください。
""",
    "need_properties" :{
        "求人概要" : {"type" : "STRING"},
        "求人説明" : {"type" : "STRING"},
        "求人リンク" : {"type" : "STRING"}
  }
}

def get_company_infos(user_information):
    company_search_agent = VertexAIBaseAgent(
        company_search_config["system_prompt"]
    )
    company_infos = company_search_agent.generate(
        company_search_config["need_properties"],
        user_information
    )
    return company_infos

def get_recruit_infos(company_info_text):
    recruit_search_agent = VertexAIBaseAgent(
        recruit_search_config["system_prompt"]
    )
    recruit_infos = recruit_search_agent.generate(
        recruit_search_config["need_properties"],
        company_info_text
    )
    return recruit_infos

def recurit_search(user_information):
    recruit_infos_list = []
    company_infos = get_company_infos(user_information)
    for company_info in company_infos:
        company_info_text = f"{str(company_info)}"
        recruit_infos = get_recruit_infos(company_info_text)
        for recruit_info in recruit_infos:
            recruit_info["会社"] = company_info["会社"]
            recruit_info["担当業務"] = company_info["担当業務"]
            recruit_infos_list.append(recruit_info)
    return recruit_infos_list

def predict(user_information):
    response = recurit_search(user_information)
    return response
