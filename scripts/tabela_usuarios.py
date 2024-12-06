import os
from dotenv import load_dotenv
from supabase import create_client, Client

# Carrega as variáveis de ambiente
load_dotenv()

# Configuração do cliente Supabase
url: str = os.environ.get("VITE_SUPABASE_URL")
key: str = os.environ.get("VITE_SUPABASE_ANON_KEY")
supabase: Client = create_client(url, key)

def adicionar_coluna_id_usuario():
    try:
        # Adiciona a coluna id_usuario na tabela usuarios
        print("Adicionando coluna id_usuario...")
        response_add_column = supabase.postgrest.post("/rpc", json={
            "sql": """
                ALTER TABLE usuarios
                ADD COLUMN IF NOT EXISTS id_usuario UUID DEFAULT gen_random_uuid();
            """
        })
        if response_add_column.status_code != 200:
            raise Exception(f"Erro ao adicionar coluna: {response_add_column.json()}")

        # Preenche os registros existentes
        print("Preenchendo registros existentes com UUIDs...")
        response_update = supabase.postgrest.post("/rpc", json={
            "sql": """
                UPDATE usuarios
                SET id_usuario = gen_random_uuid()
                WHERE id_usuario IS NULL;
            """
        })
        if response_update.status_code != 200:
            raise Exception(f"Erro ao atualizar registros: {response_update.json()}")

        # Adiciona restrição de unicidade
        print("Adicionando restrição de unicidade na coluna id_usuario...")
        response_add_constraint = supabase.postgrest.post("/rpc", json={
            "sql": """
                ALTER TABLE usuarios
                ADD CONSTRAINT unique_id_usuario UNIQUE (id_usuario);
            """
        })
        if response_add_constraint.status_code != 200:
            raise Exception(f"Erro ao adicionar restrição: {response_add_constraint.json()}")

        print("Coluna id_usuario adicionada e preenchida com sucesso!")

    except Exception as e:
        print(f"Erro ao adicionar ou preencher a coluna: {str(e)}")

if __name__ == "__main__":
    adicionar_coluna_id_usuario()
