from models.user import UserProfile

# サンプル
# 実際はもっとしっかりしたロジックになる
def search_personalized_offers(profile: UserProfile) -> str:
    """
    ユーザーの経歴情報から求人を検索し、一覧にして返す
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
