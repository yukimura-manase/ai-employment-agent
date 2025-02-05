from models.user import UserProfile

# サンプル
# 実際はしっかりしたロジックをつなぎこむ
def generate_information_sheet(profile: UserProfile) -> str:
    """
    ユーザーの経歴情報からシンプルな情報シート（テキスト形式）を生成する例
    """
    lines = [
        f"Name: {profile.name}",
        f"Email: {profile.email}",
        "",
        "Biography:",
        profile.bio or "N/A",
        "",
        "Work Experiences:"
    ]
    for exp in profile.experiences:
        lines.append(f" - {exp.position} at {exp.company} ({exp.start_date} - {exp.end_date or 'Present'})")
    
    lines.append("")
    lines.append("Skills:")
    lines.append(", ".join(profile.skills))
    
    return "\n".join(lines)
