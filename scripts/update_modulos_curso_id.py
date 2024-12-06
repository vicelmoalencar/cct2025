import os
from dotenv import load_dotenv
from supabase import create_client, Client

# Carrega as variáveis de ambiente
load_dotenv()

# Configuração do cliente Supabase
url: str = os.environ.get("VITE_SUPABASE_URL")
key: str = os.environ.get("VITE_SUPABASE_ANON_KEY")
supabase: Client = create_client(url, key)

def update_modulos_curso_id():
    try:
        # Busca todos os módulos com id_bubble_curso definidos
        response = supabase.table('modulos').select('id_bubble_modulo, id_bubble_curso, id_curso').execute()

        # Verifica se a consulta retornou dados
        if not response.data:
            print(f"Erro ou nenhum módulo encontrado. Resposta: {response}")
            return

        modulos = response.data
        print(f"Total de módulos encontrados: {len(modulos)}")

        for modulo in modulos:
            id_bubble_modulo = modulo.get('id_bubble_modulo')
            id_bubble_curso = modulo.get('id_bubble_curso')
            id_curso_existente = modulo.get('id_curso')

            # Verifica se os campos necessários estão disponíveis
            if not id_bubble_modulo:
                print("Módulo encontrado sem id_bubble_modulo. Ignorando...")
                continue

            if not id_bubble_curso:
                print(f"Módulo {id_bubble_modulo} não possui id_bubble_curso. Ignorando...")
                continue

            if id_curso_existente:
                print(f"Módulo {id_bubble_modulo} já possui id_curso definido ({id_curso_existente}). Ignorando...")
                continue

            # Busca o curso correspondente ao id_bubble_curso
            curso_response = supabase.table('cursos')\
                .select('id_curso')\
                .eq('id_bubble_curso', id_bubble_curso)\
                .execute()

            if not curso_response.data:
                print(f"Nenhum curso encontrado para id_bubble_curso {id_bubble_curso}. Resposta: {curso_response}")
                continue

            cursos = curso_response.data
            # Obtém o primeiro curso correspondente e atualiza o módulo
            curso_id = cursos[0]['id_curso']
            update_response = supabase.table('modulos')\
                .update({'id_curso': curso_id})\
                .eq('id_bubble_modulo', id_bubble_modulo)\
                .execute()

            if not update_response.data:
                print(f"Erro ao atualizar módulo {id_bubble_modulo}. Resposta: {update_response}")
            else:
                print(f"Módulo {id_bubble_modulo} atualizado com sucesso. id_curso: {curso_id}")

        print("\nAtualização concluída!")

    except Exception as e:
        print(f"Erro durante a execução: {str(e)}")

if __name__ == "__main__":
    update_modulos_curso_id()
