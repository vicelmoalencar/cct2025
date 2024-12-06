import os
from dotenv import load_dotenv
from supabase import create_client, Client

# Carrega as variáveis de ambiente
load_dotenv()

# Configuração do cliente Supabase
url: str = os.environ.get("VITE_SUPABASE_URL")
key: str = os.environ.get("VITE_SUPABASE_ANON_KEY")
supabase: Client = create_client(url, key)

def update_aulas_with_id_modulo():
    try:
        # Busca todas as aulas com id_bubble_modulo
        response_aulas = supabase.table('aulas').select('id, id_bubble_modulo').execute()

        if not response_aulas.data:
            print("Nenhuma aula encontrada ou erro ao buscar aulas.")
            return

        aulas = response_aulas.data
        print(f"Total de aulas encontradas: {len(aulas)}")

        for aula in aulas:
            id_aula = aula.get('id')
            id_bubble_modulo = aula.get('id_bubble_modulo')

            # Verifica se os campos necessários estão disponíveis
            if not id_aula or not id_bubble_modulo:
                print(f"Aula {id_aula} sem id_bubble_modulo. Ignorando...")
                continue

            # Busca o id_modulo correspondente na tabela modulos
            response_modulo = supabase.table('modulos')\
                .select('id_modulo')\
                .eq('id_bubble_modulo', id_bubble_modulo)\
                .execute()

            if not response_modulo.data:
                print(f"Nenhum módulo encontrado para id_bubble_modulo {id_bubble_modulo}.")
                continue

            id_modulo = response_modulo.data[0]['id_modulo']

            # Atualiza a tabela aulas com o id_modulo
            update_response = supabase.table('aulas')\
                .update({'id_modulo': id_modulo})\
                .eq('id', id_aula)\
                .execute()

            if not update_response.data:
                print(f"Erro ao atualizar aula {id_aula}.")
            else:
                print(f"Aula {id_aula} atualizada com sucesso. id_modulo: {id_modulo}")

        print("\nAtualização concluída!")

    except Exception as e:
        print(f"Erro durante a execução: {str(e)}")

if __name__ == "__main__":
    update_aulas_with_id_modulo()
