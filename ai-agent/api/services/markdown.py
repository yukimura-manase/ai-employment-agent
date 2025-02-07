from mdutils.mdutils import MdUtils

"""
Agentの出力をmarkdown化するためのモジュール
"""

def write_entrysheet(entrysheet_items: dict) -> str:
    return str(entrysheet_items)

def write_job_search_result(search_result_items: list[dict]) -> str:
    return str(search_result_items)
