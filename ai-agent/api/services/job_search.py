import os

from langchain_core.tools import Tool
from langchain_openai import OpenAI
from langchain.agents import initialize_agent
from langchain_google_community import GoogleSearchAPIWrapper

GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")
GOOGLE_CSE_ID = os.environ.get("GOOGLE_CSE_ID")

# langchain agentを使って、求人検索を行う。
# 実際はopenaiではなくgeminiで行う

class JobSearchAgent():
    def __init__(self):
        self.search = GoogleSearchAPIWrapper()
        self.tool = Tool(
            name="google_search",
            description="求人検索",
            func=self.search.run,
        )
        self.tools = [self.tool]
        self.llm = OpenAI(temperature=0)
        self.agent = initialize_agent(
            self.tools,
            self.llm,
            agent="zero-shot-react-description",
            verbose=True
        )

    def execute(self):
        search_prompt = """
        あなたは転職支援エージェントです。
        私はエンジニアの求人を探しています。
        実在する求人データから、以下の条件に合う最新の求人情報を検索してください。
        {keywords}
        3件の求人情報を抽出し、
        求人タイトル、企業名、勤務地、年収、求人URLの5項目について、
        title, company, location, salary, urlをkeyとしたjsonのリストで返してください。
        """
        keywords = ["Python", "AWS", "リモートワーク", "年収700万円以上", "東京"]
        prompt = search_prompt.format(keywords=" ".join(keywords))
        print(prompt)
        self.response = self.agent.run(prompt)
        print(self.response)
        return self.response


class SimpleLangChainAgent():
    def __init__(self):
        self.init_search()
        self.init_llm()
    
    def init_search(self):
        self.search = GoogleSearchAPIWrapper()

    def init_llm(self):
        self.llm = OpenAI(temperature=0)

    def execute(self):
        prompt = "python"
        response = self.search.run(prompt)
        print(response)

        llm_prompt = f"以下の検索結果を要約してください:\n\n{response}"
        llm_response = self.llm.generate([llm_prompt])
        return llm_response
