from mdutils.mdutils import MdUtils

"""
Agentの出力をmarkdown化するためのモジュール
"""

def write_entrysheet(entrysheet_items: list[dict[str, str]]) -> str:
    md = MdUtils(file_name='')
    md.new_header(level=1, title='あなたのアピール項目')
    if not entrysheet_items:
        return "No entry sheet data provided."
    entrysheet_item = entrysheet_items[0]
    for key, value in entrysheet_item.items():
        md.new_header(level=2, title=key)
        md.new_paragraph(value)
    return md.get_md_text()

def write_job_search_result(search_result_items: list[dict[str, str]]) -> str:
    md = MdUtils(file_name='')
    md.new_header(level=1, title='検索結果')
    for item in search_result_items:
        md.new_header(level=2, title=item.get('会社', 'Untitled'))
        for key, value in item.items():
            if key != 'title':
                md.new_line(f"**{key}**: {value}")
    return md.get_md_text()