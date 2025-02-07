# supabase の接続とかテスト

import os
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

supabase_url = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
supabase_key = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")

supabase: Client = create_client(supabase_url, supabase_key)

response = supabase.table("User").select("*").execute()
print(response)



'''
python ai-agent/api/services/db_test.py
'''
