# app/supabase_client.py
from dotenv import load_dotenv
import os
from supabase import create_client, Client

load_dotenv()

# tenta nomes comuns e faz fallback
SUPABASE_URL = os.getenv("SUPABASE_URL") or os.getenv("URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") or os.getenv("SUPABASE_KEY") or os.getenv("KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("SUPABASE_URL e SUPABASE_KEY não configurados. Verifique o .env")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def get_client() -> Client:
    return supabase
