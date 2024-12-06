import os
import uuid
from dotenv import load_dotenv
from supabase import create_client, Client

# Carrega as variáveis de ambiente
load_dotenv()

# Configuração do cliente Supabase
url: str = os.environ.get("VITE_SUPABASE_URL")
key: str = os.environ.get("VITE_SUPABASE_ANON_KEY")
supabase: Client = create_client(url, key)

def preencher_id_modulo():
    try:
        # Busca todos os módulos sem id_modulo preenchido
        response_modulos = supabase.table('modulos').select('id_bubble_modulo, id_modulo').execute()

        if not response_modulos.data:
            print("Nenhum módulo encontrado na tabela 'modulos'.")
            return

        modulos = response_modulos.data
        print(f"Total de módulos encontrados: {len(modulos)}")

        for modulo in modulos:
            id_bubble_modulo = modulo.get('id_bubble_modulo')
            id_modulo = modulo.get('id_modulo')

            # Verifica se o id_modulo já está preenchido
            if id_modulo:
                print(f"Módulo com id_bubble_modulo {id_bubble_modulo} já possui id_modulo: {id_modulo}. Ignorando...")
                continue

            # Gera um novo UUID para o id_modulo
            novo_id_modulo = str(uuid.uuid4())

            # Atualiza o módulo com o novo id_modulo
            update_response = supabase.table('modulos')\
                .update({'id_modulo': novo_id_modulo})\
                .eq('id_bubble_modulo', id_bubble_modulo)\
                .execute()

            if not update_response.data:
                print(f"Erro ao atualizar módulo com id_bubble_modulo {id_bubble_modulo}.")
            else:
                print(f"Módulo com id_bubble_modulo {id_bubble_modulo} atualizado com sucesso. Novo id_modulo: {novo_id_modulo}")

        print("\nAtualização concluída!")

    except Exception as e:
        print(f"Erro durante a execução: {str(e)}")

if __name__ == "__main__":
    preencher_id_modulo()
