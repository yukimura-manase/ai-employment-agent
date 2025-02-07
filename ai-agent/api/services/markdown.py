from mdutils.mdutils import MdUtils

"""
Agentの出力をmarkdown化するためのモジュール
"""

def write_entrysheet(entrysheet_items: dict[str, str]) -> str:
    md = MdUtils(file_name='')
    for key, value in entrysheet_items.items():
        md.new_header(level=2, title=key)
        md.new_paragraph(value)
    return md.get_md()

def write_job_search_result(search_result_items: list[dict[str, str]]) -> str:
    md = MdUtils(file_name='')
    for item in search_result_items:
        md.new_header(level=2, title=item.get('title', 'Untitled'))
        for key, value in item.items():
            if key != 'title':
                md.new_line(f"**{key}**: {value}")
    return md.get_md()