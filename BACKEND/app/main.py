# main.py
from fastapi import FastAPI
from .routes import router  # Importação relativa se estiverem no mesmo módulo
# OU (se main.py e routes.py estiverem no mesmo nível e você não usa módulos/pacotes):
# from routes import router # (Como estava, mas pode causar problemas de estrutura)

app = FastAPI(title="API iFood Usercode")

# Incluir rotas
app.include_router(router)